import React, { useState, useEffect } from 'react';
import { FaTelegramPlane } from 'react-icons/fa';

const SHEET_ID = '1ze8Eewdpn_oRGK-mbtZGmXoqhZ7HRt7Q0RWAWPkPsKM';
const API_KEY = 'AIzaSyAYvGFCGvY0JNSEBwbxXcexbYHWnuVtqMo';
const USERS_RANGE = 'Users!A2:C';
const DEADLINE_RANGE = 'D&T!A2:B';
const RULES_DOC_URL = 'https://docs.google.com/document/d/1aefvkCaIvtl5rzh3weIz3GdovzOb3uoKTXo-SpEF-Jw/export?format=txt';

const AnnulmentPortal = () => {
    const [users, setUsers] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [error, setError] = useState('');
    const [deadline, setDeadline] = useState({ date: '', time: '' });
    const [rules, setRules] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${USERS_RANGE}?key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (data.values) {
                    setUsers(data.values.map(row => ({ username: row[0], role: row[1], password: row[2] })));
                }
            })
            .catch(error => console.error('Ошибка загрузки пользователей:', error));
    }, []);

    useEffect(() => {
        fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${DEADLINE_RANGE}?key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                if (data.values && data.values.length > 0) {
                    setDeadline({ date: data.values[0][0], time: data.values[0][1] });
                }
            })
            .catch(error => console.error('Ошибка загрузки дедлайна:', error));
    }, []);

    useEffect(() => {
        fetch(RULES_DOC_URL)
            .then(response => response.text())
            .then(text => {
                setRules(text);
            })
            .catch(error => console.error('Ошибка загрузки правил:', error));
    }, []);

    const handleLogin = () => {
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            setRole(user.role);
            setIsLoggedIn(true);
        } else {
            setError('Неверные учетные данные');
        }
    };

    return (
        <div className={`min-h-screen p-6 transition-all duration-500 ${darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-900'} font-[Russo+One]`}>            
            <header className="flex justify-between items-center bg-gray-800 text-white p-4 rounded-lg shadow-lg">
                <span className="text-2xl font-bold">АННУЛЯЦИЯ</span>
                <div className="flex items-center space-x-4">
                    <a href="https://t.me/NUR_tishenbekuulu" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm hover:underline">
                        <FaTelegramPlane className="text-xl" />
                        <span>TELEGRAM</span>
                    </a>
                    <span className="text-sm">📞 996703000558</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                        <div className="w-14 h-8 flex items-center bg-gray-400 rounded-full p-1 duration-300 ease-in-out peer-checked:bg-magenta-500">
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform duration-300 ease-in-out ${darkMode ? 'translate-x-6' : ''}`}></div>
                        </div>
                    </label>
                    {isLoggedIn && <button className="bg-red-500 text-white px-3 py-1 rounded-lg shadow-md" onClick={() => setIsLoggedIn(false)}>Выйти</button>}
                </div>
            </header>
            {!isLoggedIn ? (
                <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-lg mt-10 border border-gray-300">
                    <h2 className="text-xl font-bold mb-4 text-center">Вход</h2>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    <input type="text" placeholder="Логин" className="w-full mb-2 p-3 border border-gray-400 rounded-lg text-black" onChange={e => setUsername(e.target.value)} />
                    <input type="password" placeholder="Пароль" className="w-full mb-2 p-3 border border-gray-400 rounded-lg text-black" onChange={e => setPassword(e.target.value)} />
                    <button className="w-full bg-[#FF00FF] text-white px-4 py-2 rounded-lg shadow-lg mt-4 hover:bg-[#D600D6] transform active:scale-95 transition-all font-bold" onClick={handleLogin}>
                        Войти
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-between items-center bg-[#FF00FF] p-4 rounded-lg shadow-lg text-lg mt-6 border border-gray-400">
                        <span>Дедлайн занесения записей на аннуляцию: {deadline.date} {deadline.time}</span>
                        <a href="https://docs.google.com/spreadsheets/d/1BirGW6mHEPOGstQVX82kDEAeVNhRC_iB-SleyWzQ8cc/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="bg-black text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transform active:scale-95 transition-all">Файл аннуляции</a>
                        {role === 'admin' || role === 'dev' ? (
                            <a href='https://docs.google.com/spreadsheets/d/1ze8Eewdpn_oRGK-mbtZGmXoqhZ7HRt7Q0RWAWPkPsKM/edit?usp=sharing' target='_blank' rel='noopener noreferrer' className='bg-black text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-800 transform active:scale-95 transition-all'>Файл пользователей</a>
                        ) : null}
                    </div>
                    <div className={`text-left w-full max-w-4xl mx-auto mt-6 bg-opacity-90 p-6 rounded-lg shadow-lg border border-gray-300 ${darkMode ? 'bg-gray-100 text-black font-bold' : 'bg-white text-gray-900'}`}>
                        <h1 className="text-2xl font-bold text-center">Правила аннуляции</h1>
                        <pre className="mt-4 text-lg whitespace-pre-wrap break-words">{rules}</pre>
                    </div>
                </>
            )}
        </div>
    );
};

export default AnnulmentPortal;
