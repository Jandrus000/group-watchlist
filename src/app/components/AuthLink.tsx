'user client';

import Image from 'next/image';
import { loginWithGoogle, logout, signUp, logIn } from '../lib/firebase/auth';
import { useAuthContext } from '../context/AuthContext';
import Modal from './Modal';
import { useState } from 'react';
import styles from '../styles/page.module.css';

// TODO refactor component to not be so cluttered, why is it posting on a bad form?. make sign up and log in logic the same

export default function AuthLink() {
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
    const { user } = useAuthContext();
    // states for sign up
    const [newUsername, setNewUserName] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [isPasswordsSame, setIsPasswordsSame] = useState(true);
    // states for log-in
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [logInError, setLogInError] = useState('');

    const handleGoogleLogin = async () => {
        await loginWithGoogle();
        setIsSignUpModalOpen(false);
        setIsLogInModalOpen(false);
    };

    const HandleSignUp = async () => {
        const passwordsMatch = password1 === password2;
        setIsPasswordsSame(passwordsMatch);

        if (passwordsMatch && password1 !== '' && password2 !== '' && newUsername !== '' && newEmail !== '') {
            await signUp(newEmail, password1, newUsername);
            setIsSignUpModalOpen(false);
            setPassword1('');
            setPassword2('');
            setNewEmail('');
            setNewUserName('');
        }
        // TODO more error messages for using used email, built-in required field errors not appearing anymore
    };

    const HandleLogIn = async () => {
        try {
            await logIn(email, password);
            setIsLogInModalOpen(false);
            setEmail('');
            setPassword('');
            setLogInError('');
        } catch (_) {
            setLogInError(`Invalid email or password`);
        }
    };

    return (
        <div id="profile-nav">
            {/* sign up */}
            <Modal isOpen={isSignUpModalOpen}>
                <button
                    className="x-button"
                    onClick={() => setIsSignUpModalOpen(false)}
                >
                    <Image
                        src={'/cross.svg'}
                        alt={'close'}
                        width={20}
                        height={20}
                    />
                </button>
                <h2 className="form-header">Sign up</h2>
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className={styles.signInForm}
                >
                    <label htmlFor="username">Username:</label>
                    <input
                        id="username"
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUserName(e.target.value)}
                        required
                    />

                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        required
                    />

                    <label>Password:</label>
                    <input
                        type="password"
                        value={password1}
                        minLength={6}
                        className="password-input"
                        onChange={(e) => setPassword1(e.target.value)}
                        required
                    />

                    <label>Re-enter Password:</label>
                    <input
                        type="password"
                        value={password2}
                        minLength={6}
                        className="password-input"
                        onChange={(e) => setPassword2(e.target.value)}
                        required
                    />

                    {!isPasswordsSame && <p>Your passwords need to match</p>}

                    <button
                        className="submit-button"
                        type="submit"
                        onClick={HandleSignUp}
                    >
                        Create account
                    </button>
                    <span className="account-redirect">
                        Already have an account?{' '}
                        <a
                            onClick={() => {
                                setIsSignUpModalOpen(false);
                                setIsLogInModalOpen(true);
                            }}
                        >
                            Log in
                        </a>
                    </span>
                    <div className="online-submit-footer">
                        <hr />
                        <span>or</span>
                        <hr />
                    </div>
                </form>
                <div className="google-button-container">
                    <button
                        onClick={handleGoogleLogin}
                        className="google-signin-button"
                    >
                        <Image
                            src="/Google__G__logo.png"
                            height={25}
                            width={25}
                            alt="Google logo"
                        />
                        Sign in with Google
                    </button>
                </div>
            </Modal>

            {/* log in */}
            <Modal isOpen={isLogInModalOpen}>
                <button
                    className="x-button"
                    onClick={() => setIsLogInModalOpen(false)}
                >
                    <Image
                        src={'/cross.svg'}
                        alt={'close'}
                        width={20}
                        height={20}
                    />
                </button>
                <h2 className="form-header">Log in</h2>
                {logInError !== '' && <div>{logInError}</div>}
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        HandleLogIn();
                    }}
                    className={styles.signInForm}
                >
                    <label htmlFor="email">Email:</label>
                    <input
                        id="email"
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        className="password-input"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button className="submit-button" type="submit">
                        Login
                    </button>
                </form>

                <span className="account-redirect">
                    Dont have an account?{' '}
                    <a
                        onClick={() => {
                            setIsLogInModalOpen(false);
                            setIsSignUpModalOpen(true);
                        }}
                    >
                        Sign up
                    </a>
                </span>

                <div className="online-submit-footer">
                    <hr />
                    <span>or</span>
                    <hr />
                </div>
                <div className="google-button-container">
                    <button
                        onClick={handleGoogleLogin}
                        className="google-signin-button"
                    >
                        <Image
                            src="/Google__G__logo.png"
                            height={15}
                            width={15}
                            alt="Google logo"
                        />
                        Sign in with google
                    </button>
                </div>
            </Modal>
            <div className="dropdown">
                <Image
                    src="/profile-round-1342.svg"
                    width={25}
                    height={25}
                    alt=""
                    className="dropdown-button"
                />
                {user ? (
                    <>
                        <span className="user-welcome">Welcome {user.displayName}</span>
                        <div className="dropdown-content">
                            <button onClick={logout}>Log out</button>
                        </div>
                    </>

                ) : (
                    <div className="dropdown-content">
                        <button onClick={() => setIsSignUpModalOpen(true)}>
                            Sign up
                        </button>
                        <button onClick={() => setIsLogInModalOpen(true)}>
                            Log in
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
