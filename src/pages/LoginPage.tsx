import React from 'react';
import LoginForm from '../components/LoginForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-slate-50 to-slate-100 p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                    Ragnet
                </h1>
                <p className="text-slate-600 text-sm">
                    Your AI DevRel
                </p>
            </div>
            
            <Card className="w-full max-w-md border-none shadow-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-semibold text-center">
                        Sign in / Register
                    </CardTitle>
                    <p className="text-sm text-slate-500 text-center">
                        Enter your credentials to access your account
                    </p>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;