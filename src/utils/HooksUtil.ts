import { useCallback, useEffect } from 'react';

/**
 * Utility hook for handling menu component setup in views
 * This helps avoid repetitive useEffect patterns across multiple view components
 */
export const useMenuSetup = (
    menuProps: { 
        setMenuComponentContent: React.Dispatch<React.SetStateAction<JSX.Element>>;
        setNavigationContent: React.Dispatch<React.SetStateAction<any[]>>;
    },
    menuComponent: JSX.Element,
    navigationContent: any[] = []
) => {
    const setupMenu = useCallback(() => {
        menuProps.setMenuComponentContent(menuComponent);
        menuProps.setNavigationContent(navigationContent);
    }, [menuProps, menuComponent, navigationContent]);

    useEffect(() => {
        setupMenu();
    }, [setupMenu]);
};

/**
 * Utility for handling data loading with dependencies
 * Helps reduce useEffect dependency issues
 */
export const useDataLoader = <T extends any[]>(
    loadFunction: () => void,
    dependencies: T
) => {
    const memoizedLoad = useCallback(loadFunction, dependencies);
    
    useEffect(() => {
        memoizedLoad();
    }, [memoizedLoad]);
};