
module.exports = function (app) {

  // 404s
  app.use(function (req, res, next) {
    res.status(404);

    if (req.accepts('html')) {
      return res.render('error',{error404:'404',layout:false});
    }

    if (req.accepts('json')) {
      return res.json({ error: 'Not Found', Code:'404' });
    }

    // default response type
    res.type('txt');
    res.send("Hmmm, couldn't find that page.");
  })

   // 500
  app.use(function (err, req, res, next) {
    console.error('error at %s\n', req.url, err.stack);
    res.render('error',{error404:'',layout:false});
  })

}
