import {Star} from "lucide-react";

export default function RatingStars({value = 0, onChange, size = 18, interactive = false}) {
    return <div className="flex gap-1" aria-label={`Rating ${value} out of 5`}>{[1, 2, 3, 4, 5].map(n => <button key={n}
                                                                                                                 type="button"
                                                                                                                 disabled={!interactive}
                                                                                                                 onClick={() => onChange?.(value === n ? 0 : n)}
                                                                                                                 className={`${interactive ? "hover:scale-110" : ""} transition ${n <= value ? "text-amber-400" : "text-slate-600"}`}
                                                                                                                 title={interactive ? (value === n ? "Clear rating" : `Rate ${n} stars`) : undefined}>
        <Star size={size} fill={n <= value ? "currentColor" : "none"}/></button>)}</div>
}
