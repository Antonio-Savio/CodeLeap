import styles from './input.module.css'

interface InputProps{
    placeholder: string;
    id: string;
    type: 'text' | 'password' | 'email';
    value: string;
    setValue: (value: string) => void;
}

export function Input({ value, setValue, type, id, placeholder }: InputProps){
    return(
        <input
            type={type} 
            id={id}
            className={styles.box} 
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    )
}