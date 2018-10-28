const { forEach } = require('p-iteration');

async function getTradeInfo(id, ctx) {
  const trade = await ctx.orm.trade.findById(id);
  trade.publication = await ctx.orm.publication.findOne(
    {
      include: [
        {
          model: ctx.orm.request,
          include: [
            {
              model: ctx.orm.trade,
              where: { id: trade.id },
            },
          ],
        },
      ],
    },
  );
  trade.emmiter = await trade.publication.getUser();
  trade.emmiter.item = await trade.publication.getItem();
  trade.receptor = await ctx.orm.user.findOne(
    {
      include: [
        {
          model: ctx.orm.request,
          include: [
            {
              model: ctx.orm.trade,
              where: { id: trade.id },
            },
          ],
        },
      ],
    },
  );
  try {
    const request = await trade.getRequest();
    trade.receptor.item = await request.getItem();
  } catch (error) {
    trade.receptor.item = null;
  }
  trade.review = await trade.getReview();
  return trade;
}

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
          try {
            const publ = await itm.getPublication();
            aux.publication = publ;
          } catch (e) {
            aux.publication = null;
          }
        }
        final.push(aux);
      });
      return final;
  },

  getUserTrades: async function (ctx, user) {

    const publications = await user.getPublications();
    const own_requests = await user.getRequests();

    let reviews = {};
    let trades = [];
    let own_requests_id = [];
    let all_info = []

    receptingTrades = await ctx.orm.trade.findAll({
      include: [
        {
          model: ctx.orm.request,
          required: true,
          include: [
            {
              model: ctx.orm.user,
              required: true,
              where: { id: user.id }
            },
          ],
        },
      ],
    });

    emitingTrades = await ctx.orm.trade.findAll({
      include: [
        {
          model: ctx.orm.request,
          required: true,
          include: [
            {
              model: ctx.orm.publication,
              required: true,
              include: [
                {
                  model: ctx.orm.user,
                  required: true,
                  where: { id: user.id }
                },
              ],
            },
          ],
        },
      ],
    });

    for (trade_index in emitingTrades) {
      let trade = emitingTrades[trade_index];
      let review = await trade.getReview();
      let complete_trade = await getTradeInfo(trade.id, ctx);
      reviews[trade.id] = review;
      trades.push(complete_trade);
    }

    for (trade_index in receptingTrades) {
      let trade = receptingTrades[trade_index];
      let review = await trade.getReview();
      let complete_trade = await getTradeInfo(trade.id, ctx);
      reviews[trade.id] = review;
      trades.push(complete_trade);
    }

    console.log(trades);
    console.log(reviews);
    return {'trades': trades, 'reviews': reviews};

  },

  getOnlyTrades: async function (ctx, user) {
    const publications = await user.getPublications();
    const own_requests = await user.getRequests();

    const trades = [];

    await publications.forEach(async (publication) => {
      const requests = await publication.getRequests();
      await requests.forEach( async (req) => {
        const trade = await req.getTrade();
        if (trade && trade.state === 'pendent') {
          trade.my_publication = publication;
          trade.other_publication = null;
          if (req.item_offered_id) {
            trade.is_gift = false;
            trade.item = await ctx.orm.item.findById(req.item_offered_id);
          } else {
            trade.is_gift = true;
            trade.item = null;
          }
          trade.other_user = await ctx.orm.user.findById(req.userID);
          trades.push(trade);
        }
      });
    });

    await own_requests.forEach(async (req) => {
      const trade = await req.getTrade();
      if (trade && trade.state === 'pendent') {
        const publication = await req.getPublication();
        trade.other_publication = publication;
        trade.my_publication = null;
        if (req.item_offered_id) {
          trade.is_gift = false;
          trade.item = await ctx.orm.item.findById(req.item_offered_id);
        } else {
          trade.is_gift = true;
          trade.item = null;
        }
        trade.other_user = await ctx.orm.user.findById(publication.userID);
        trades.push(trade);
      }
    });
    return trades;
  },

  getTradeInfo: getTradeInfo,

};
