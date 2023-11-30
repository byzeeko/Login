// app.js
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
require('dotenv').config()
const app = express();
const PORT = process.env.PORT || 1313;
const jwt = require('jsonwebtoken');
const cors = require('cors'); // Import the cors middleware


app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.json());


app.use(cors({ origin: 'http://localhost:3000', credentials: true }));


// Configurer le transporteur
const transporter = nodemailer.createTransport({
  service: 'gmail', // Utilisez le service de messagerie que vous préférez
  auth: {
    user: process.env.usernameMail,
    pass: process.env.mailPassword,
  },
});

// Configuration de Sequelize
const sequelize = new Sequelize({
  username: process.env.dbUsername,
  password: process.env.dbPassword,
  database: "Test",
  host: "localhost",
  dialect: "mysql"
});

// Définition du modèle User
const User = sequelize.define('User', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
        },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
    },
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  refreshToken: {
    type: Sequelize.STRING,
    allowNull: true
  },
  role: {
    type: Sequelize.STRING,
    defaultValue: 'user'
  },
  recoveryToken: {
    type:Sequelize.STRING,
  }

});

function generateRandomPassword(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
  }
  return password;
}


function generateToken(user) {
  const { id, username, createdAt, email, role } = user;
  return jwt.sign({ id, username, createdAt, email, role }, '1313', { expiresIn: '1h' });
}

app.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
          return res.status(404).json({ message: 'Email not found' });
      }

      // Générez un token de récupération de mot de passe
      const recoveryToken = jwt.sign({ email }, '1313', { expiresIn: '1h' });

      // Mise à jour du token dans la base de données
      await user.update({ recoveryToken });

      ///const resetLink = `http://localhost:3000/reset-password?token=${recoveryToken}`;


      const resetLink = `http://localhost:3000/test/${recoveryToken}` ;
      const mailOptions = {
          from: 'zeekzeekoo4@gmail.com',
          to: email,
          subject: 'Récupération de mot de passe',
          text: `Utilisez ce lien pour réinitialiser votre mot de passe: ${resetLink}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return res.status(500).json({ message: 'Error sending email' });
          }
          return res.status(200).json({ message: 'Email sent successfully' });
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.post('/reset-password', async (req, res) => {
  const { token } = req.query;

  try {
      // Vérifiez la validité du token
      const decodedToken = jwt.verify(token, '1313');
      const email = decodedToken.email;

      // Recherchez l'utilisateur associé au token dans la base de données
      const user = await User.findOne({ where: { email } });

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      if (user.recoveryToken === null) {
        return res.status(400).json({ message: 'Token has already been used. Please request a new one.' });
    }
      // Générez un nouveau mot de passe aléatoire
      const newPassword = generateRandomPassword(12); // Vous pouvez ajuster la longueur selon vos besoins

      // Mise à jour du mot de passe dans la base de données
      await user.update({ password: newPassword, recoveryToken: null });


  
      const mailOptions = {
          from: 'zeekzeekoo4@gmail.com',
          to: email,
          subject: 'Nouveau mot de passe',
          text: ` votre mot de passe: ${newPassword}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return res.status(500).json({ message: 'Error sending email' });
          }
          return res.status(200).json({ message: 'Email sent successfully' });
      });


      return res.status(200).json({ message: 'Password reset successfully , veuillez vérifier votre mail pour avoir votre nouveau mot de passe', newPassword });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
  }
});



app.get('/getAllLogs', async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.findAll({ attributes: ['id', 'username', 'email', 'createdAt', 'role'] });

    // Extract relevant user data
    const userData = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
    }));

    // Send the user data in the response
    res.status(200).json(userData);
  } catch (error) {
    console.error('Error retrieving user logs:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route pour refresh
app.post('/refreshAccessToken', async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    console.log('Received refresh token:', refreshToken);

    if (!refreshToken) {
      console.log('Refresh token not provided');
      return res.status(401).json({ error: 'Refresh token not provided' });
    }

    // Vérifier le token
    const decoded = jwt.verify(refreshToken, '1313');
    
    console.log('Decoded refresh token:', decoded);

    // TRouver l'user
    const user = await User.findByPk(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      console.log('Invalid refresh token');
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

 
    const newToken = generateToken(user);


    res.cookie('token', newToken, { httpOnly: false, maxAge: 60000 });

    console.log('New access token generated:', newToken);

    res.status(200).json({ message: 'Access token refreshed successfully' });
    console.log('User ID after generating new access token:', user.role);
  } catch (error) {
    console.error('Error refreshing access token:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});




app.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      let missingFields = [];

      if (!username) {
        missingFields.push("username");
      }

      if (!password) {
        missingFields.push("password");
      }

      if (!email) {
        missingFields.push("email");
      }

      return res.status(400).json({ error: `Les champs suivants doivent être remplis : ${missingFields.join(', ')}` });
    }

    // Vérifier si le nom d'utilisateur existe déjà
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(400).json({ error: 'Ce nom d\'utilisateur existe déjà. Veuillez choisir un autre nom d\'utilisateur.' });
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ error: 'Cet email existe déjà. Veuillez choisir une autre adresse email.' });
    }

    // Si le nom d'utilisateur et l'email sont uniques, créer l'utilisateur
    const newUser = await User.create({ username, password, email });
    res.status(201).json(newUser);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/editUser/:userId', async (req, res) => {
  const { userId } = req.params;
  const { newUsername, newEmail , selectedRole} = req.body;

  try {
    // Recherchez l'utilisateur par ID
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    



    // Mettez à jour le nom d'utilisateur si fourni et vérifier si l'username existe déjà
    if (newUsername) {
      const usernameExists = await User.findOne({ where: { username: newUsername } });

      if (usernameExists && usernameExists.id !== userId) {
        return res.status(400).json({ message: 'Username already in use' });
      }

      user.username = newUsername;
    }


    // Mettez à jour l'e-mail si fourni et si il existe déjà
    if (newEmail) {
      const emailExists = await User.findOne({ where: { email: newEmail } });

      if (emailExists && emailExists.id !== userId) {
        return res.status(400).json({ message: 'Email already in use' });
      }

      user.email = newEmail;
    }
      // Mettez à jour le rôle
      if (selectedRole) {
        user.role = selectedRole;
      }

      
    await user.save();

    res.json({
      message: 'User updated successfully',
      newUsername: user.username,
      newEmail: user.email,
      selectedRole: user.role,
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      let missingFields = [];

      if (!password) {
        missingFields.push("password");
      }

      if (!email) {
        missingFields.push("email");
      }

      return res.status(400).json({ error: `Les champs suivants doivent être remplis : ${missingFields.join(', ')}` });
    }

    const findUserAndPassWord = await User.findOne({ where: { email }, attributes: ['id', 'password', 'username', 'createdAt', 'role', 'refreshToken'] });

    if (!findUserAndPassWord || findUserAndPassWord.password !== password) {
      res.status(401).json({ error: "L'email ou le mot de passe n'est pas correct" });
      return;
    }

    const { id, username, createdAt, role } = findUserAndPassWord;
    const token = generateToken(findUserAndPassWord);
    const refreshToken = jwt.sign({ id  }, '1313', { expiresIn: '1h' });

    // Mise à jour du refreshToken dans la base de données
    await findUserAndPassWord.update({ refreshToken });

    res.cookie('token', token, { httpOnly: false, maxAge: 60000 });
    res.cookie('refreshToken', refreshToken, { httpOnly: false, maxAge: 6000000 });
    res.status(200).json({
      message: 'Vous êtes connecté avec succès',
      user: {
        id,
        email,
        username,
        createdAt,
        role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});