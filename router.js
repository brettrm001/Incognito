var express = require("express");
var router = express.Router();

const userModel = require('./models/user.js')
const bcrypt = require('bcrypt');
// Functions
async function isLoggedIn(email) {
	if (!email) return res.redirect('/login')
	const model = await userModel.findOne({ email })
	if (model) {
		if (model.lockReason) return res.redirect('/locked')
	} else {
		return res.redirect('/login')
	}
	return
}

// login user
router.post('/login', async (req, res, ) => {
	await isLoggedIn(req?.session?.user?.email || null)
	const search = await userModel.findOne({ email: req.body.email })
	if (!search) return res.render('base', { title: 'Homework Helper | Beta', error: "Invalid email address." })
	bcrypt.compare(req.body.password, search.password, function(err, result) {
		if (!result) return res.render('base', { title: 'Homework Helper | Beta', error: "Invalid password." })
		req.session.user = search
		res.redirect('/dashboard')
	});
});

// register user
router.get('/register', async(req, res) => {
	await isLoggedIn(req?.session?.user?.email || null)
	res.render('register', { title: "Homework Helper | Beta", user: req.session.user })
})

router.post('/register', async (req, res) => {
	if(req.session.user) return res.redirect('/')
	await isLoggedIn(req?.session?.user?.email || null)
	const search = await userModel.findOne({ email: req.body.email })
	if (search) return res.render('register', { title: "Homework Helper | Beta", error: "Email is already registered." })
	// Password Hashing
	const saltRounds = 10
	bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
		await new userModel({
			email: req.body.email,
			username: req.body.username,
			password: hash
		}).save()
	});
	//
	return res.render('register', { title: "Homework Helper | Beta", success: "Your account was successfully registered. Return to the login page to login to it." })
})

// route for dashboard
router.get('/dashboard', async(req, res) => {
	if (req.session.user) {
		await isLoggedIn(req?.session?.user?.email || null)
		res.render('incognito/index', { title: "Homework Helper | Beta", user: req.session.user })
	} else {
		res.redirect('/')
	}
})

// route for logout
router.get('/logout', async(req, res) => {
	req.session.destroy(function(err) {
		if (err) {
			console.log(err);
			res.send("Error")
		} else {
			res.render('base', { title: "Homework Helper | Beta", logout: "Logged out successfully!" })
		}
	})
})

router.get('/locked', async(req, res) => {
	if(!req.session.user || !req.session.user.lockReason) return res.redirect('/')
	if(req.session.user.lockReason === false) return res.redirect('/') 
	res.render('locked', { title: 'Homework Helper | Beta', user: req.session.user })
})

module.exports = router;