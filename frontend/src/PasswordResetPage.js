import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { verify_link, reset_password } from './ApiRequest';
import Loading from './components/Loading';

export default function PasswordResetPage() {
    const { uidb64, token } = useParams();
    let navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isValidLink, setIsValidLink] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetSuccess, setResetSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const verifyPasswordResetLink = async () => {
            try {
                const response = await verify_link(uidb64, token);
                if (response.success)
                    setIsValidLink(true);
                else {
                    setIsValidLink(false);
                    navigate("http://127.0.0.1:8000/404");
                }
            } catch (error) {
                setError(error);
            }
        };

        verifyPasswordResetLink();
    }, [uidb64, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        const response = await reset_password(uidb64, token, password);
        if (response.success)
            setResetSuccess(true);
        else
            setError(response.error);

        setLoading(false)

    };

    return (
        <div className="flex justify-center items-center min-h-screen text-white">
            {isValidLink === null ? (
                <Loading size={16} />
            ) : isValidLink ? (
                resetSuccess ? (
                    <div className='text-green-500'>Your password have been changed!</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="newPassword" className="font-bold text-lg">
                            New Password
                        </label>
                        <br />
                        <input
                            required
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            className="sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 text-black"
                            placeholder="••••••••"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <br />

                        <label htmlFor="confirmPassword" className="font-bold text-lg">
                            Confirm Password
                        </label>
                        <br />
                        <input
                            required
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 text-black"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                        />
                        <br />

                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        {!loading ? (
                            <button
                                className="inline-flex bg-blue-600 items-center justify-center w-full py-2 rounded-full text-xl text-white font-montserrat"
                                type="submit"
                            >
                                Change password
                            </button>
                        ) : (
                            <p className="inline-flex bg-blue-600 items-center justify-center w-full py-2 rounded-full text-xl text-center text-white font-montserrat">
                                <Loading color={"green-500"} />
                            </p>
                        )}
                    </form>
                )
            ) : (
                <div>Invalid Link</div>
            )}
        </div>
    );
}