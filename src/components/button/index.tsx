import { ReactNode } from 'react';
import styles from './button.module.css'

interface ButtonProps{
    children: ReactNode;
    color?: 'red' | 'blue' | 'green' | 'cancel';
    disable?: boolean;
    handleClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
}

export function Button({ type = 'button', handleClick, disable = false, color, children }: ButtonProps){    
    return(
        <button 
            type={type} 
            className={`${styles.button} ${color ? styles[color] : ''} ${disable && styles.disabled}`}
            disabled={disable}
            onClick={handleClick}
        >
            {children}
        </button>
    )
}