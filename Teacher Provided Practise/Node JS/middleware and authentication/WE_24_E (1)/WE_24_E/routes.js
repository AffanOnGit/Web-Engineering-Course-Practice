const express = require('express');
const router = express.Router();

// GET: /add?a=10&b=20
router.get('/add', (req, res) => {
    const { a, b } = req.query;
    res.send(`Sum is: ${+a + +b}`);
});
// GET: /add/a/10/b/20
router.get('/add/a/:a/b/:b', (req, res) => {
    const { a, b } = req.params;
    res.send(`Sum is: ${+a + +b}`);
});
// POST (Form): /add
router.post('/add', express.urlencoded({ extended: true }), (req, res) => {
    const { a, b } = req.body;
    res.send(`Sum is: ${+a + +b}`);
});
// POST (JSON): /add
router.post('/add', express.json(), (req, res) => {
    const { a, b } = req.body;
    res.send(`Sum is: ${a + b}`);
});
// Export the router
module.exports = router;
