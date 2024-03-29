import express from 'express';
import User from '../models/userModel';
import { getToken, isAuth } from '../util';
import bcrypt from 'bcryptjs';

const router = express.Router();

router.put('/:id', isAuth, async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }
    const updatedUser = await user.save();
    res.send({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: getToken(updatedUser),
    });
  } else {
    res.status(404).send({ message: 'User Not Found' });
  }
});

router.post('/signin', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: getToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: 'Invalid email or password' });
})


router.post('/register' , async (req, res) => {
  const finduser = await User.findOne({ email: req.body.email });
  if(finduser){
    res.status(409).send({message:"Email-Id already exists "});
  }
  else{
    try{
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const newUser = await user.save();
      res.status(201).send({
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: false,
        token: getToken(newUser),
      });
    } catch(error) {
      res.status(400).send({message:error.message});
        
    }
  }
});

router.get('/createadmin', async (req, res) => {
  try {
    const user = new User({
      name: 'jatin',
      email: 'bhanu@patyal.com',
      password: bcrypt.hashSync('Patyalbhanu22', 8),
      isAdmin: true,
    });
    const newUser = await user.save();
    res.send(newUser);
  } catch (error) {
    res.send({ message: error.message });
  }
});

export default router;
