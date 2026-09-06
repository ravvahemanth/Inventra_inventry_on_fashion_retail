import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, Cloud, ShieldCheck, Layers, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { login, firebaseLogin } from '../../services/authService';
import { auth, signInWithGoogle, getRedirectResult, mapFirebaseAuthError } from '../../config/firebase';
import { useToast } from '../../context/ToastContext';

function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    // If user is already authenticated, directly navigate to dashboard
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Process redirect result if popup was blocked
    const processRedirect = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result && result.user) {
          setLoading(true);
          const user = result.user;
          const idToken = await user.getIdToken();
          const firebaseUserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            photoURL: user.photoURL,
            idToken: idToken
          };
          const response = await firebaseLogin(firebaseUserData);
          toast.success(`Welcome, ${response.data.user?.username || firebaseUserData.displayName}!`);
          window.location.href = '/dashboard';
        }
      } catch (err) {
        console.error("Redirect auth error:", err);
        const friendlyMsg = mapFirebaseAuthError(err);
        if (friendlyMsg) {
          toast.error(friendlyMsg);
        }
      } finally {
        setLoading(false);
      }
    };
    processRedirect();
  }, [navigate, toast]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const firebaseUserData = await signInWithGoogle();
      if (!firebaseUserData) return; // Handled by redirect fallback
      const response = await firebaseLogin(firebaseUserData);
      toast.success(`Welcome, ${response.data.user?.username || firebaseUserData.displayName}!`);
      window.location.href = '/dashboard';
    } catch (err) {
      console.error("Google sign-in error:", err);
      const friendlyMsg = mapFirebaseAuthError(err);
      if (friendlyMsg) {
        toast.error(friendlyMsg);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleQuickLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await login({ email, password });
      toast.success(`Welcome back, ${response.data.user?.username || 'Executive'}!`);
      window.location.href = '/dashboard';
    } catch (err) {
      const errorMsg = err.message || err.error || 'Login failed.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.warning('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await login(formData);
      toast.success(`Welcome back, ${response.data.user?.username || 'Executive'}!`);
      navigate('/dashboard');
    } catch (err) {
      const errorMsg = err.message || err.error || 'Invalid email or password. Please verify and retry.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Column: Modern Cloud Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-800 to-slate-900 p-12 flex-col justify-between text-white">
        {/* Subtle Ambient Radial Highlights */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-indigo-700 shadow-lg shadow-black/10">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold font-display tracking-tight text-white">INVENTRA</h1>
            <p className="text-xs font-medium text-indigo-200 tracking-wide">Smart Fashion Retail Cloud</p>
          </div>
        </div>

        {/* Center Showcase Statement */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-indigo-100">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> Next-Gen Apparel Operations
          </div>
          <h2 className="text-4xl sm:text-5xl font-extrabold font-display text-white tracking-tight leading-tight">
            The Modern Operating System for Fashion Retail.
          </h2>
          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-normal">
            Real-time variant inventory tracking, multi-tier size and color matrices, predictive low-stock risk alerts, and audit transaction ledgers.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
              <TrendingUp className="w-5 h-5 text-indigo-200 mb-2" />
              <h4 className="text-sm font-bold text-white">Live Stock Tracking</h4>
              <p className="text-xs text-indigo-200 mt-0.5">Instant size & color variant counts</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-emerald-300 mb-2" />
              <h4 className="text-sm font-bold text-white">Automated Risk Sentinel</h4>
              <p className="text-xs text-indigo-200 mt-0.5">Threshold warnings & restock actions</p>
            </div>
          </div>
        </div>

        {/* Bottom Status */}
        <div className="relative z-10 text-xs text-indigo-200/80 flex items-center justify-between border-t border-white/10 pt-6">
          <span>Enterprise Cloud v2.4</span>
          <span>Fast, Reliable & Encrypted</span>
        </div>
      </div>

      {/* Right Column: Clean White Form Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
        <div className="w-full max-w-md space-y-7">
          {/* Mobile Top Brand (Visible on mobile only) */}
          <div className="flex lg:hidden items-center gap-2.5 pb-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900">INVENTRA</span>
              <span className="text-[11px] text-indigo-600 font-semibold block -mt-0.5">Smart Fashion Retail Cloud</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 tracking-tight">
              Sign In to Your Workspace
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Enter your credentials to access the fashion retail management portal.
            </p>
          </div>



          {/* Google Social Login */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-2.5 shadow-2xs transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {googleLoading ? (
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
              <span>{googleLoading ? 'Connecting to Google...' : 'Sign In with Google'}</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-slate-50 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider absolute">
                Or with corporate email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
                Corporate Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@inventra.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold tracking-wide text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>SIGN IN TO WORKSPACE</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-bold transition-colors">
                Request Registration →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
