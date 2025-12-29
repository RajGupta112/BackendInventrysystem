import bcrypt from 'bcrypt';
import prisma from '../PrismaClient.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();


export  const register = async (req,res)=>{
  const {name,email,password}=req.body;
  try {
    const hashPassoword= await bcrypt.hash(password,10);
    const user = await prisma.user.create({
      data:{
        name,
        email,
        password:hashPassoword,
      }
    })
    res.status(201).json({message:"User registered successfully"});
  } catch (error) {
     res.status(500).json({error:"Error registering user"});
  }
}

export  const login= async(req,res)=>{
  const {email,password}= req.body;

  try {
    const user= await prisma.user.findUnique({
      where:{email}
    })
    if(!user){
      return res.status(404).json({error:"User not found"});
    }
    const isPasswordValid= await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
      return res.status(401).json({error:"Invalid password"});
    }

    const token= jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:'1d'});
    res.json({token,user:{id:user.id,name:user.name,email:user.email}});

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

}