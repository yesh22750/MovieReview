export default function LoadingGrid() {
    return <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{Array.from({length: 10}, (_, i) =>
        <div key={i} className="overflow-hidden rounded-2xl border border-white/8 bg-white/[.03]">
            <div className="skeleton aspect-[2/3]"/>
            <div className="space-y-2 p-3.5">
                <div className="skeleton h-4 w-4/5 rounded"/>
                <div className="skeleton h-3 w-2/5 rounded"/>
            </div>
        </div>)}</div>
}
