import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Register",
};

export default function RegisterPage() {
	return (
		<>
			<div className="mb-8">
				<p className="text-sm font-medium text-slate-500">Create your account</p>
				<h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
					Register
				</h1>
				<p className="mt-2 text-sm leading-6 text-slate-600">
					Fill in your details to make a new account.
				</p>
			</div>

			<form className="grid gap-4 md:grid-cols-2">
				<div className="md:col-span-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
					<p className="text-sm font-medium text-slate-900">
						Education profile
					</p>
					<p className="mt-1 text-sm text-slate-600">
						Share a few details so the consultancy system can suggest better guidance.
					</p>
				</div>

				<div className="space-y-2">
					<label htmlFor="name" className="text-sm font-medium text-slate-700">
						Full Name
					</label>
					<input
						id="name"
						name="name"
						type="text"
						autoComplete="name"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
						placeholder="Your full name"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="username"
						className="text-sm font-medium text-slate-700"
					>
						Username
					</label>
					<input
						id="username"
						name="username"
						type="text"
						autoComplete="username"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
						placeholder="Choose a username"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="studyLevel"
						className="text-sm font-medium text-slate-700"
					>
						Current Study Level
					</label>
					<select
						id="studyLevel"
						name="studyLevel"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
						defaultValue=""
					>
						<option value="" disabled>
							Select level
						</option>
						<option value="high-school">High School</option>
						<option value="diploma">Diploma</option>
						<option value="undergraduate">Undergraduate</option>
						<option value="postgraduate">Postgraduate</option>
					</select>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="destination"
						className="text-sm font-medium text-slate-700"
					>
						Preferred Study Destination
					</label>
					<select
						id="destination"
						name="destination"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
						defaultValue=""
					>
						<option value="" disabled>
							Select country
						</option>
						<option value="usa">United States</option>
						<option value="uk">United Kingdom</option>
						<option value="canada">Canada</option>
						<option value="australia">Australia</option>
						<option value="europe">Europe</option>
					</select>
				</div>

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
					<label htmlFor="phone" className="text-sm font-medium text-slate-700">
						Phone Number
					</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						autoComplete="tel"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
						placeholder="+977 9800000000"
					/>
				</div>

				<div className="space-y-2 md:col-span-2">
					<label
						htmlFor="fieldOfStudy"
						className="text-sm font-medium text-slate-700"
					>
						Intended Course or Field
					</label>
					<input
						id="fieldOfStudy"
						name="fieldOfStudy"
						type="text"
						autoComplete="off"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
						placeholder="Computer Science, Business, Medicine, etc."
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="intake"
						className="text-sm font-medium text-slate-700"
					>
						Preferred Intake
					</label>
					<select
						id="intake"
						name="intake"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
						defaultValue=""
					>
						<option value="" disabled>
							Select intake
						</option>
						<option value="spring">Spring</option>
						<option value="summer">Summer</option>
						<option value="fall">Fall</option>
						<option value="winter">Winter</option>
					</select>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="budget"
						className="text-sm font-medium text-slate-700"
					>
						Budget Range
					</label>
					<select
						id="budget"
						name="budget"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
						defaultValue=""
					>
						<option value="" disabled>
							Select budget
						</option>
						<option value="under-10k">Under $10,000</option>
						<option value="10k-20k">$10,000 - $20,000</option>
						<option value="20k-35k">$20,000 - $35,000</option>
						<option value="35k-plus">Above $35,000</option>
					</select>
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
						autoComplete="new-password"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
						placeholder="Create a password"
					/>
				</div>

				<div className="space-y-2">
					<label
						htmlFor="confirmPassword"
						className="text-sm font-medium text-slate-700"
					>
						Confirm Password
					</label>
					<input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						autoComplete="new-password"
						required
						className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
						placeholder="Re-enter your password"
					/>
				</div>

				<label className="md:col-span-2 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
					<input
						id="terms"
						name="terms"
						type="checkbox"
						required
						className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
					/>
					<span>I agree to the terms and conditions.</span>
				</label>

				<button
					type="submit"
					className="md:col-span-2 w-full rounded-lg bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
				>
					Register
				</button>
			</form>

			<p className="mt-6 text-center text-sm text-slate-600">
				Already have an account?{" "}
				<Link href="/login" className="font-medium text-slate-900 underline-offset-4 hover:underline">
					Log in
				</Link>
			</p>
		</>
	);
}
