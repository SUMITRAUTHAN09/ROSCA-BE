import express from 'express';
import * as userController from '../controllers/userController.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { signupSchema, loginSchema } from '../validation/userValidation.js';

const router = express.Router();

router.post('/signup', validateRequest({ body: signupSchema }), userController.signupUser);
router.post('/login', validateRequest({ body: loginSchema }), userController.loginUser);

import {
  forgotPasswordSchema,
  verifyOtpSchema,
  resetPasswordSchema,
} from '../validation/userValidation.js';

router.post('/forgot-password', validateRequest({ body: forgotPasswordSchema }), userController.forgotPassword);
router.post('/verify-otp', validateRequest({ body: verifyOtpSchema }), userController.verifyOtp);
router.post('/reset-password', validateRequest({ body: resetPasswordSchema }), userController.resetPassword);

export default router;
