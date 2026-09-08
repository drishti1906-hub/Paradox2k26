import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import AmongUsCharacter from './AmongUsCharacter';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../src/lib/supabase';

const TEAM_COLORS = [
  { name: 'Red', hex: '#C51111' },
  { name: 'Blue', hex: '#132ED1' },
  { name: 'Green', hex: '#117F2D' },
  { name: 'Pink', hex: '#ED54BA' },
  { name: 'Orange', hex: '#EF7D0D' },
  { name: 'Yellow', hex: '#F5F557' },
  { name: 'Black', hex: '#3F474E' },
  { name: 'White', hex: '#D6E0F0' },
  { name: 'Purple', hex: '#6B2FBB' },
  { name: 'Cyan', hex: '#38FEDC' }
];

export default function AuthModal({ onLogin }) {

  const [terminalId, setTerminalId] = useState('');
  const [passcode, setPasscode] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [error, setError] = useState('');

  const teamColor = useMemo(() => {

    if (!terminalId) {
      return TEAM_COLORS[0];
    }

    let hash = 0;

    for (let i = 0; i < terminalId.length; i++) {
      hash =
        terminalId.charCodeAt(i) +
        ((hash << 5) - hash);
    }

    return TEAM_COLORS[
      Math.abs(hash) % TEAM_COLORS.length
    ];

  }, [terminalId]);


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (isLoggingIn) return;

    setError('');

    const username = terminalId.trim();
    const accessCode = passcode.trim();

    if (!username) {
      setError('ENTER A USERNAME');
      return;
    }

    if (!accessCode) {
      setError('ENTER YOUR FRIEND CODE');
      return;
    }

    setIsLoggingIn(true);

    try {

      console.log('Attempting login...');

      const { data, error: supabaseError } =
        await supabase.rpc(
          'login_player',
          {
            p_username: username,
            p_access_code: accessCode
          }
        );

      console.log('Supabase response:', data);
      console.log('Supabase error:', supabaseError);

      if (supabaseError) {
        console.error(
          'Supabase login error:',
          supabaseError
        );

        setError('CONNECTION ERROR');
        setIsLoggingIn(false);

        return;
      }

      // No matching access code
      if (!data || data.length === 0) {

        setError('INVALID FRIEND CODE');
        setIsLoggingIn(false);

        return;
      }

      const player = data[0];

      console.log('LOGIN SUCCESS:', player);

      // Send the complete player information to App.jsx
      onLogin({
        username: player.username,
        team_number: player.team_number,
        role: player.role
      });

    } catch (err) {

      console.error('Unexpected login error:', err);

      setError('CONNECTION ERROR');
      setIsLoggingIn(false);

    }

  };


  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md bg-black/60"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >

      <motion.div
        className="w-full max-w-[42rem] bg-[#E8EDE4] rounded-[2.5rem] border-[6px] border-white shadow-2xl relative overflow-hidden flex flex-col"
        initial={{
          y: 50,
          opacity: 0,
          scale: 0.95
        }}
        animate={{
          y: 0,
          opacity: 1,
          scale: 1
        }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 20
        }}
      >

        {/* Background design */}

        <div className="absolute inset-0 opacity-20 pointer-events-none">

          <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path
              d="M-50,150 Q200,-50 400,200 T800,0"
              fill="none"
              stroke="#7CB342"
              strokeWidth="40"
            />

            <path
              d="M200,400 Q400,200 600,400 T1000,100"
              fill="none"
              stroke="#7CB342"
              strokeWidth="30"
            />

            <path
              d="M-100,50 Q100,300 400,250"
              fill="none"
              stroke="#7CB342"
              strokeWidth="60"
            />

          </svg>

        </div>


        <form
          onSubmit={handleSubmit}
          className="relative z-10 flex flex-col p-6 sm:p-8 font-sans"
        >

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10">

            {/* Character */}

            <div className="flex-shrink-0 flex flex-col items-center">

              <div className="bg-white rounded-3xl w-48 h-48 sm:w-60 sm:h-60 p-4 border-[5px] border-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center justify-center relative overflow-hidden">

                <AmongUsCharacter
                  color={teamColor.hex}
                  className="w-[80%] h-[80%] drop-shadow-md z-10"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-200 opacity-50"></div>

              </div>

            </div>


            {/* Information */}

            <div className="flex-grow flex flex-col pt-2 text-gray-600">


              {/* Username */}

              <div className="mb-4">

                <label className="text-xl text-gray-500 font-bold uppercase tracking-wide block mb-1">
                  Username
                </label>

                <input
                  type="text"
                  className="w-full bg-transparent text-3xl sm:text-4xl font-normal text-gray-800 outline-none placeholder-gray-400"
                  placeholder="Team Name"
                  value={terminalId}
                  onChange={(e) => {
                    setTerminalId(e.target.value);
                    setError('');
                  }}
                  required
                  autoFocus
                />

              </div>


              {/* Friend Code */}

              <div className="mb-6">

                <label className="text-xl text-gray-500 font-bold uppercase tracking-wide block mb-1">
                  Friend Code
                </label>

                <div className="relative flex items-center">

                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full bg-transparent text-2xl font-black text-gray-800 outline-none placeholder-gray-400 uppercase tracking-widest pr-12"
                    placeholder="ENTER PASSCODE"
                    value={passcode}
                    onChange={(e) => {
                      setPasscode(e.target.value);
                      setError('');
                    }}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-2 p-1.5 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
                  >

                    {showPassword ? (
                      <Eye
                        size={22}
                        className="text-gray-700"
                      />
                    ) : (
                      <EyeOff
                        size={22}
                        className="text-gray-700"
                      />
                    )}

                  </button>

                </div>

              </div>


              {/* Error */}

              <div className="min-h-[28px] mb-3">

                {error && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    className="text-red-600 font-bold text-lg uppercase"
                  >
                    {error}
                  </motion.div>
                )}

              </div>


              {/* Stats */}

              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-600 font-medium">

                <div>
                  <div className="text-base text-gray-500 tracking-wide mb-1">
                    Height
                  </div>

                  <div className="text-xl">
                    3'6"
                  </div>
                </div>


                <div>
                  <div className="text-base text-gray-500 tracking-wide mb-1">
                    Weight
                  </div>

                  <div className="text-xl">
                    92lbs
                  </div>
                </div>


                <div>
                  <div className="text-base text-gray-500 tracking-wide mb-1">
                    Level
                  </div>

                  <div className="text-xl">
                    100
                  </div>
                </div>


                <div>
                  <div className="text-base text-gray-500 tracking-wide mb-2">
                    XP
                  </div>

                  <div className="w-full h-3 bg-white rounded-none border border-gray-300 relative">

                    <div className="absolute left-0 top-0 h-full w-[80%] bg-[#22A546]"></div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* Login button */}

          <div className="mt-10 mb-2 flex flex-wrap justify-center gap-4 sm:gap-6">

            <button
              type="submit"
              disabled={isLoggingIn}
              className={`px-12 py-2.5 bg-black text-white text-lg font-medium rounded-[0.5rem] border-[3px] border-white shadow-md transition-transform ${isLoggingIn
                ? 'opacity-80'
                : 'hover:scale-105 active:scale-95'
                }`}
            >

              {isLoggingIn
                ? 'CONNECTING...'
                : 'Login'}

            </button>

          </div>

        </form>

      </motion.div>

    </motion.div>
  );
}