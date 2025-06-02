'user client';

import Image from 'next/image';
import { loginWithGoogle, logout, signUp, logIn } from '../lib/firebase/auth';
import { useAuthContext } from '../context/AuthContext';
import Modal from './Modal';
import { useState } from 'react';

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

		if (passwordsMatch) {
			await signUp(newEmail, password1, newUsername);
			setIsSignUpModalOpen(false);
		}
		// TODO more error messages for using used email, built-in required field errors not appearing anymore
		setPassword1('');
		setPassword2('');
		setNewEmail('');
		setNewUserName('');
		setIsPasswordsSame(true);
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
				<button onClick={() => setIsSignUpModalOpen(false)}>X</button>
				<h2>Sign up</h2>
				<form onSubmit={(e) => e.preventDefault()}>
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
						onChange={(e) => setPassword1(e.target.value)}
						required
					/>

					<label>Re-enter Password:</label>
					<input
						type="password"
						value={password2}
						onChange={(e) => setPassword2(e.target.value)}
						required
					/>

					{!isPasswordsSame && <p>Your passwords need to match</p>}

					<button type="submit" onClick={HandleSignUp}>
						Submit
					</button>
				</form>
				<button onClick={handleGoogleLogin}>
					<Image
						src="/Google__G__logo.png"
						height={15}
						width={15}
						alt="Google logo"
					/>
					Sign in with google
				</button>
			</Modal>

			{/* log in */}
			<Modal isOpen={isLogInModalOpen}>
				<button onClick={() => setIsLogInModalOpen(false)}>X</button>
				<h2>Log in</h2>
				{logInError !== '' && <div>{logInError}</div>}
				<form
					onSubmit={ async (e) => {
						e.preventDefault();
						HandleLogIn();
					}}
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
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<button type="submit">proceed</button>
				</form>
				<button onClick={handleGoogleLogin}>
					<Image
						src="/Google__G__logo.png"
						height={15}
						width={15}
						alt="Google logo"
					/>
					Sign in with google
				</button>
			</Modal>

			<Image
				src="/profile-round-1342.svg"
				width={25}
				height={25}
				alt=""
			/>
			{user ? (
				<>
					<span>Welcome {user.displayName}</span>
					<button onClick={logout}>Log out</button>
				</>
			) : (
				<>
					<button onClick={() => setIsSignUpModalOpen(true)}>
						Sign up
					</button>
					<button onClick={() => setIsLogInModalOpen(true)}>
						Log in
					</button>
				</>
			)}
		</div>
	);
}
