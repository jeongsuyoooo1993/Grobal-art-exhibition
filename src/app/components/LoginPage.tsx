import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface LoginPageProps {
  onLoginSuccess: () => void;
  onGoHome: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        console.error('로그인 오류:', signInError);
        setError(`로그인 실패: ${signInError.message}`);
      } else {
        onLoginSuccess();
      }
    } catch (err) {
      console.error('예외 발생:', err);
      setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-black border border-white/10 p-8">
        <h1 className="text-2xl text-white mb-8 text-center tracking-wider">관리자 로그인</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/70 text-sm mb-2" htmlFor="email">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          
          <div>
            <label className="block text-white/70 text-sm mb-2" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/20 text-white px-4 py-3 focus:outline-none focus:border-white/40 transition-colors"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 hover:bg-white/90 transition-colors duration-300 font-medium tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <button
            onClick={onGoHome}
            className="text-white/50 hover:text-white transition-colors text-sm"
          >
            ← 홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
