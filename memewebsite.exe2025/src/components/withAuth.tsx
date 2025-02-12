"use client";

import { useState, useEffect } from 'react';
import { isAuthenticated } from '@/lib/utils'; // Your auth check logic
import { ComponentType } from 'react';

interface AuthenticatedComponentProps {
    [key: string]: unknown;
}

const withAuth = <P extends object>(WrappedComponent: ComponentType<P>) => {
    const AuthenticatedComponent = (props: AuthenticatedComponentProps) => {
        const [isClient, setIsClient] = useState<boolean>(false); // To track if it's on client-side

        useEffect(() => {
            // Mark as client-side once component is mounted
            setIsClient(true);

            // Redirect if not authenticated
            if (!isAuthenticated()) {
                window.location.href = '/sign-in'; 
            }
        }, []);

        // If not on the client side yet, return null to avoid SSR mismatch
        if (!isClient) {
            return null; // Prevent rendering during SSR
        }

        if (!isAuthenticated()) {
            return null; // If not authenticated after client check
        }

        return <WrappedComponent {...(props as P)} />;
    };

    // Set the display name for better debugging
    AuthenticatedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return AuthenticatedComponent;
};

export default withAuth;
