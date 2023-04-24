import { ReactNode } from "react"

interface CardProps {
    title: string
    className: any
}

export function Card({ title, className }: CardProps) {
    return (
        <div className={className} >
            <p>{title}</p>
        </div>
    )
}