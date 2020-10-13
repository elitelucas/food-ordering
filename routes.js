const {
  validateLogin,
  authenticate,
  listUsers,
  search,
  find,
  createUser,
  editUser,
  deleteUser
} = require('./controllers/users');
const {
  // listTier2,
  // patchTier2,
  // detailTier2,
  // imageTier2,
  // listTier3,
  // patchTier3,
  // detailTier3,
  // imageTier3,
  
} = require('./controllers/admin');

const requireAdmin = require('./middlewares/requireAdmin');
const requireAuth = require('./middlewares/requireAuth');

const multer = require("multer");
const router = require('express').Router();
const tier = multer({
  dest: "/uploads/temp"
});

//authentication

// router.get('/emailVerify',requireAuth, requestEmailVerify);
// router.post('/emailVerify',requireAuth, resultEmailVerify);
router.post('/authenticate', validateLogin, authenticate);

//admin
router.get('/admin/users', [requireAuth,requireAdmin], listUsers);
router.get('/admin/users/:search', [requireAuth,requireAdmin], search);
router.get('/admin/user/:username', [requireAuth,requireAdmin],  find);
router.post('/admin/user', [requireAuth,requireAdmin,validateLogin], createUser);
router.put('/admin/user/:id', [requireAuth,requireAdmin], editUser);
router.delete('/admin/user/:id', [requireAuth,requireAdmin], deleteUser);
// router.get('/admin/tier2', [requireAuth,requireAdmin],  listTier2);
// router.patch('/admin/tier2/:id', [requireAuth,requireAdmin],  patchTier2);
// router.get('/admin/tier2/image/:id', [requireAuth,requireAdmin],  imageTier2);
// router.get('/admin/tier2/:id', [requireAuth,requireAdmin],  detailTier2);

// router.get('/admin/tier3', [requireAuth,requireAdmin],  listTier3);
// router.patch('/admin/tier3/:id', [requireAuth,requireAdmin],  patchTier3);
// router.get('/admin/tier3/image/:id', [requireAuth,requireAdmin],  imageTier3);
// router.get('/admin/tier3/:id', [requireAuth,requireAdmin],  detailTier3);


//wallet manage
// router.post('/wallet', [requireAuth,validateWallet], createWallet);
// router.get('/wallet', requireAuth, listWallet);
// router.delete('/wallet/:title', requireAuth, removeWallet);
//users

//tiers
// router.get('/tier2',requireAuth , getTier2);
// router.get('/tier3',requireAuth , getTier3);
// router.post('/tier2',[requireAuth, tier.single('tier2')], postTier2);
// router.post('/tier3',[requireAuth, tier.single('tier3')], postTier3);


//questions
// router.param('question', loadQuestions);
// router.post('/questions', [requireAuth, questionValidate], createQuestion);
// router.get('/question/:question', show);
// router.get('/question', listQuestions);
// router.get('/questions/:tags', listByTags);
// router.get('/question/user/:username', listByUser);
// router.delete('/question/:question', [requireAuth, questionAuth], removeQuestion);

//tags
// router.get('/tags/populertags', listPopulerTags);
// router.get('/tags/:tag', searchTags);
// router.get('/tags', listTags);

//answers
// router.param('answer', loadAnswers);
// router.post('/answer/:question', [requireAuth, answerValidate], createAnswer);
// router.delete('/answer/:question/:answer', [requireAuth, answerAuth], removeAnswer);

// //votes
// router.get('/votes/upvote/:question/:answer?', requireAuth, upvote);
// router.get('/votes/downvote/:question/:answer?', requireAuth, downvote);
// router.get('/votes/unvote/:question/:answer?', requireAuth, unvote);

// //comments
// router.param('comment', loadComments);
// router.post('/comment/:question/:answer?', [requireAuth, validate], createComment);
// router.delete('/comment/:question/:comment', [requireAuth, commentAuth], removeComment);
// router.delete('/comment/:question/:answer/:comment', [requireAuth, commentAuth], removeComment);

module.exports = (app) => {
  app.use('/api', router);

  app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
      message: error.message
    });
  });
};
