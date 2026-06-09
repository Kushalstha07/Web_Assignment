import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Login",
};

export default function LoginPage() {
	return (
		<>
			<div className="mb-8">

				
				<p className="text-sm font-medium text-slate-500">Welcome back</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
					Login
				</h1>
				<p className="mt-2 text-sm leading-6 text-slate-600">
					Sign in with your email and password.
				</p>
			</div>

			<form className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="email" className="text-sm font-medium text-slate-700">
						Email
					</label>
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
						placeholder="you@example.com"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="password"
						className="text-sm font-medium text-slate-700"
					>
						Password
					</label>
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
						placeholder="Enter your password"
					/>
				</div>

				<button
					type="submit"
					className="w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
				>
					Login
				</button>
			</form>

			<p className="mt-6 text-center text-sm text-slate-600">
				No account?{" "}
				<Link href="/register" className="font-medium text-slate-900 underline-offset-4 hover:underline">
					Create one
				</Link>
			</p>
		</>
	);
}
