import React, { useState, useEffect } from 'react';

interface UserEntity {
    id: number;
    name: string;
    email: string;
    role: 'USER' | 'ADMIN' | 'SUPPORT';
}

const Test = () => {
    const [user, setUser] = useState<UserEntity | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/users/test');
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };
        fetchUser();
    }, []);

    return (
        <div>
            {user ? (
                <div>
                    <p>ID: {user.id}</p>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Role: {user.role}</p>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Test;