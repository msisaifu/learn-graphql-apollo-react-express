const bcrpt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');
const { transport, mailTemplate } = require('../services/mail');
const { hasPermission } = require('../utils');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if(!userId){
      throw new Error("You must be logged in to do that")
    }

    const item = await ctx.db.mutation.createItem(
      {
        data: {
          user: {
            connect: {
              id: userId
            }
          },
          ...args
        }
      },
      info
    )
    return item;
  },
  
  async updateItem(parent, args, ctx, info) {
    const updates = {...args};
    delete updates.id;
    const item = await ctx.db.mutation.updateItem(
      {
        data: updates,
        where: {
          id: args.id
        }
      },
      info
    )
    return item;
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };

    const item = await ctx.db.query.item({ where },
      `{
        id
        title
        user {
          id
        }
      }
    `);
    
    const ownsItem = item.user.id === ctx.request.userId;
    const hasPermissions = ctx.request.user.permissions.some(permission => ['ADMIN', 'ITEMDELETE'].includes(permission));
    
    if (!ownsItem && hasPermissions){
      throw new Error("You don't have permission to do that!");
    }
    
    return ctx.db.mutation.deleteItem(
      {
        where
      },
      info
    );
  },

  async signup(parent, args, ctx, info) {
    args.email = args.email.toLowerCase();
    const password = await bcrpt.hash(args.password, 10);

    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER', 'ADMIN', 'PERMISSIONUPDATE'] }
        }
      },
      info
    );

    const token = jwt.sign({ userId: user.id}, process.env.APP_SECRET);

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },

  async signin(parent, {email, password}, ctx, info) {
    const user = await ctx.db.query.user({ where: { email }});
    
    if(!user){
      throw new Error(`Email not found`);
    }
    
    const valid = await bcrpt.compare(password, user.password);
    
    if (!valid){
      throw new Error(`Invalid password`);
    }

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return user;
  },

  signout(parent, args, ctx, info){
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!'}
  },
  
  async requestReset(parent, { email }, ctx, info){
    const user = await ctx.db.query.user({ where: { email } });

    if (!user) {
      throw new Error(`Email not found`);
    }
    const randombytePromisified = promisify(randomBytes);
    const resetToken = (await randombytePromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000;

    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    })

    try {
      const mailRes = await transport.sendMail({
        from: 'wes@wesbos.com',
        to: res.email,
        subject: 'Your password reset token',
        html: mailTemplate(
          `Your password reset token is here!
          \n\n        
          <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
            Click here to reset
          </a>
          `
        )
      });
    } catch (error) {
      console.log("err", error)
    }

    return { message: 'Successfully resetted!' }
  },

  async resetPassword(parent, { email, password, confirmPassword, resetToken }, ctx, info) {
    if(password !== confirmPassword){
      throw new Error(`Password Not Match`);
    }
    
    const [user] = await ctx.db.query.users(
      { 
        where: { 
          resetToken,
          resetTokenExpiry_gte: Date.now() - 3600000
        } 
    });


    if (!user) {
      throw new Error(`Token expired`);
    }

    const hashPassword = await bcrpt.hash(password, 10);

    const res = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: { 
        password: hashPassword, 
        resetToken: null, 
        resetTokenExpiry: null 
      }
    })

    const token = jwt.sign({ userId: res.id }, process.env.APP_SECRET);

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    return res;
  },
  async updatePermissions(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in to do that")
    }

    const currentUser = await ctx.db.query.user(
      {
        where: {
          id: userId
        }
      }, info
    );

    hasPermission(currentUser, ['ADMIN', 'PERMISSIONUPDATE']);

    return ctx.db.mutation.updateUser(
      {
        data: {
          permissions: {
            set: args.permissions
          }
        },
        where: {
          id: args.userId
        }
      }, info
    );
  },
  async addToCart(paent, args, ctx, info){
    const { userId } = ctx.request;
    if (!userId) {
      throw new Error("You must be logged in to do that")
    }
    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: userId },
        item: { id: args.id },
      } 
    })

    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
        info
      });
    }

    return ctx.db.mutation.createCartItem({
      data: { 
        user: {
          connect: { id: userId }
        },
        item: {
          connect: { id: args.id }
        },        
      }, info
    });
  }  
};

module.exports = Mutations;
