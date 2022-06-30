var express = require("express");
var router = express.Router();

const userModel = require('./models/user.js')
const bcrypt = require('bcrypt');

// login user
router.post('/login', async (req, res, ) => {
	const search = await userModel.findOne({ email: req.body.email })
	if (!search) return res.render('base', { title: 'Homework Helper | Beta', error: "Invalid email address." })
	bcrypt.compare(req.body.password, search.password, function(err, result) {
		if (!result) return res.render('base', { title: 'Homework Helper | Beta', error: "Invalid password." })
		req.session.user = search
		res.redirect('/dashboard')
	});
});

// Register user
router.get('/register', async(req, res) => {
	// Auth Checking
	const model = await userModel.findOne({ email: req?.session?.user?.email || 'null' })
	if (model) return res.redirect('/dashboard')
	//
	res.render('register', { title: "Homework Helper | Beta", user: req.session.user })
})

router.post('/register', async (req, res) => {
	if(req.session.user) return res.redirect('/')
	const search = await userModel.findOne({ email: req.body.email })
	if (search) return res.render('register', { title: "Homework Helper | Beta", error: "Email is already registered." })
	// Password Hashing
	const saltRounds = 10
	bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
		await new userModel({
			email: req.body.email,
			username: req.body.username,
			password: hash,
			lockReason: "Your account is not verified. Please wait for a staff member to contact you about your verification. Otherwise, you can directly contact a staff member to expedite this process."
		}).save()
	});
	//
	return res.render('register', { title: "Homework Helper | Beta", success: "Your account was successfully registered. Return to the login page to login to it." })
})

// route for dashboard
router.get('/dashboard', async(req, res) => {
	// Auth Checking
	const model = await userModel.findOne({ email: req?.session?.user?.email || 'null' })
	if (!model) return res.redirect('/')
	if (model.lockReason && model?.lockReason !== "false") return res.redirect('/locked')
	//

	res.render('incognito/index', { title: "Homework Helper | Beta", user: req.session.user })
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
	// Auth
	const model = await userModel.findOne({ email: req?.session?.user?.email || 'null' })
	if (!model || model?.lockReason !== 'false') return res.redirect('/')
	if (!model.lockReason || model.lockReason === 'false') return res.redirect('/')
	//
	
	res.render('locked', { title: 'Homework Helper | Beta', user: req.session.user })
})

module.exports = router;