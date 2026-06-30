interface Props {
  step: string;
  title: string;
  description: string;
}

export default function StepListItem({ step, title, description }: Props) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 text-sm font-bold text-blue-600">
        {step}
      </div>
      <div>
        <div className="text-lg font-semibold text-slate-900">{title}</div>
        <div className="mt-1 text-base leading-relaxed text-slate-500">
          {description}
        </div>
      </div>
    </div>
  );
}