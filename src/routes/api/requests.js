const KoaRouter = require('koa-router');

const router = new KoaRouter();


router.post('request-api-new', '/new', async(ctx) => {
  ctx.assert(ctx.state.jwtdata, 401);
  const { publicationId, itemOfferedId, message } = ctx.request.body;

  // Revisar si están todos los datos importantes
  ctx.assert(publicationId, 400, 'Missing data');
  ctx.assert(message, 400, 'Missing data');
  // Checkeo que la publicación exista
  const publication = await ctx.orm.publication.findById(publicationId);
  ctx.assert(publication, 400, "Publication not found");

  // Revisar si puedo cambiar o no la publicacion
  if (publication.state === 'gift') {
    ctx.assert(itemOfferedId, 400, 'Missing data');
  }
  if (publication.state !== 'gift' && publication.state !== 'exchange') {
    ctx.assert(false, 400, 'Cannot offer for this product')
  }

  const user = await ctx.orm.user.findById(ctx.state.jwtdata.userId);
  // Checkeo que el item no haya sido ofrecido antes y que ya no se le haya hecho antes un request
  const allRequests = await user.getRequests();

  allRequests.forEach(req => {
    ctx.assert(req.item_offered_id != itemOfferedId, 400, "You've already offered this item!");
    ctx.assert(req.publication_id != publicationId, 400, "You've already asked for this item!");
  })

  // Checkeo que la publicacion no sea mia
  const allPublications = await user.getPublications();
  ctx.assert(allPublications[0].userID !== publication.userID, 400, "It's your publication");

  // Checkeo que el item pertenezca al usuario
  if (publication.state === 'exchange') {
    const results = allPublications.map(async (pub) => {
      return await pub.getItem();
    });
    const final = await Promise.all(results).then((complete) => {
      const allItemsId = [];
      complete.forEach(item => {
        allItemsId.push(item.id);
      });
      return allItemsId;
    })
    ctx.assert(final.includes(itemOfferedId), 400, 'Item not found');

    // Se crea el request en caso de no fallar :D
    await ctx.orm.request.create({
      'message': message,
      'item_offered_id': itemOfferedId,
      'publication_id': publicationId,
      'userID': user.id
    })
  } else {
    await ctx.orm.request.create({
      'message': message,
      'item_offered_id': null,
      'publication_id': publicationId,
      'userID': user.id
    })
  }

  ctx.body = 'Request Created!';

});

module.exports = router;
