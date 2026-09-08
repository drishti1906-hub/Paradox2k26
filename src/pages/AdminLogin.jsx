import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        if (loading) return;

        setLoading(true);
        setError('');

        try {
            // Login through Supabase Auth
            const { data, error: authError } =
                await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                });

            if (authError) {
                console.error('ADMIN LOGIN ERROR:', authError);
                setError(authError.message || 'Invalid login credentials');
                setLoading(false);
                return;
            }

            if (!data?.user) {
                setError('LOGIN FAILED');
                setLoading(false);
                return;
            }

            console.log('ADMIN AUTH SUCCESS:', data.user.id);

            // Check admin_users table
            const { data: adminRecord, error: adminError } =
                await supabase
                    .from('admin_users')
                    .select('user_id')
                    .eq('user_id', data.user.id)
                    .maybeSingle();

            console.log('ADMIN RECORD:', adminRecord);

            if (adminError) {
                console.error('ADMIN CHECK ERROR:', adminError);
                setError('Unable to verify admin access.');
                await supabase.auth.signOut();
                setLoading(false);
                return;
            }

            if (!adminRecord) {
                setError('YOU ARE NOT AN ADMIN');
                await supabase.auth.signOut();
                setLoading(false);
                return;
            }

            console.log('ADMIN ACCESS GRANTED');

            // Go to Admin Dashboard
            navigate('/admin');

        } catch (err) {
            console.error('UNEXPECTED ADMIN LOGIN ERROR:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#030107] text-white flex items-center justify-center px-4">

            <div className="w-full max-w-xl">

                <div className="text-center mb-10">

                    <Shield
                        size={70}
                        className="mx-auto mb-6 text-purple-500"
                    />

                    <h1 className="text-5xl font-black tracking-widest">
                        ADMIN CONTROL
                    </h1>

                    <p className="text-white/50 mt-3">
                        Authorized personnel only
                    </p>

                </div>

                <form
                    onSubmit={handleLogin}
                    className="border border-purple-500/30 bg-black/40 p-8"
                >

                    <label className="block text-purple-400 font-bold tracking-widest mb-2">
                        ADMIN EMAIL
                    </label>

                    <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter admin email"
                        className="w-full bg-white/5 border border-white/10 px-5 py-4 text-lg outline-none focus:border-purple-500 mb-6"
                        required
                    />

                    <label className="block text-purple-400 font-bold tracking-widest mb-2">
                        PASSWORD
                    </label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        placeholder="Enter password"
                        className="w-full bg-white/5 border border-white/10 px-5 py-4 text-lg outline-none focus:border-purple-500 mb-6"
                        required
                    />

                    {error && (
                        <div className="border border-red-500/50 bg-red-950/30 text-red-400 px-4 py-3 mb-6">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-500 py-4 font-black tracking-widest transition disabled:opacity-50"
                    >
                        {loading
                            ? 'AUTHENTICATING...'
                            : 'ENTER ADMIN CONTROL'}
                    </button>

                </form>

            </div>
        </div>
    );
}