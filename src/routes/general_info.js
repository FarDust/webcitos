const { forEach } = require('p-iteration');

module.exports = {

  getInfoRequests: async function (ctx, requests, category) {
    const final = [];
      await forEach(requests, async (req) => {
        const aux = {};
        aux.request = req;
        const trad = await req.getTrade();
        aux.trade = trad;
        const itm = await ctx.orm.item.findById(req.item_offered_id);
        aux.item = itm;
        if (category === "mine") {
          // Aquí quiero el usuario de la publicacion del request, la publicacion del
          // request y el item ofrecido por mi hacia ellos
          const publ = await ctx.orm.publication.findById(req.publication_id);
          aux.publication = publ;
          const usr = await ctx.orm.user.findById(publ.userID);
          aux.user = usr;
        }
        // Aquí quiero el usuario y el item del request, mientras quiero la publicacion
        // del item del request
        else
        {
          const usr = await ctx.orm.user.findById(req.userID);
          aux.user = usr;
          const publ = await itm.getPublication();
          aux.publication = publ;
        }
        final.push(aux);
      });
      return final;
  },

  getInfoTrades: async function(ctx, publications, own_requests) {

    const reviews = [];
    const trades = [];
    const own_requests_id = [];

    await publications.forEach(async (pub) => {
          const requests = await pub.getRequests();
          // console.log('requests',requests)
          await forEach(requests, async (req) => {
            const trade = await req.getTrade();
            // console.log('trade!!!!', trade)
            if (trade) {
              const review = await trade.getReview();
              reviews.push(review);
              trades.push(trade);
            }
          });
      });

      await own_requests.forEach(async (req) => {
        const trade = await req.getTrade();
        if (trade) {
          const review = await trade.getReview();
          reviews.push(review);
          trades.push(trade);
          own_requests_id.push(trade.id_request);
        }
      });
      return {'trades': trades, 'reviews': reviews, 'own_requests_id': own_requests_id};

  }

};
