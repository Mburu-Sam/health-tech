// frontend/src/pages/Patient/Dashboard.jsx
const nextAppointment = {
  doctor: 'Dr. Maya Chen',
  specialty: 'Cardiology',
  date: 'Thursday, Feb 27',
  time: '10:30 AM',
  location: 'Wellness Center, Room 305'
};

const carePlan = [
  'Take prescribed medication twice daily after meals.',
  'Walk for at least 20 minutes every evening.',
  'Log blood pressure readings before bedtime.',
  'Schedule follow-up labs within the next 2 weeks.'
];

export default function PatientDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-8">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-sky-500">Your care</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, Sarah</h1>
        <p className="mt-1 text-slate-600">
          Keep track of your upcoming appointments and care plan in one place.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <p className="text-sm font-medium text-slate-500">Next appointment</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">{nextAppointment.date}</h2>
          <p className="text-slate-500">{nextAppointment.time}</p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5">
            <p className="text-sm font-semibold text-slate-900">{nextAppointment.doctor}</p>
            <p className="text-sm text-slate-500">{nextAppointment.specialty}</p>
            <p className="mt-3 text-sm font-medium text-slate-900">Location</p>
            <p className="text-sm text-slate-600">{nextAppointment.location}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700">
              Reschedule
            </button>
            <button className="rounded-full bg-sky-500 px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-sky-600">
              Join telehealth
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Care plan</h2>
          <ul className="mt-4 space-y-3">
            {carePlan.map(item => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1 inline-block h-2 w-2 rounded-full bg-sky-500" />
                <p className="text-sm text-slate-700">{item}</p>
              </li>
            ))}
          </ul>
          <button className="mt-6 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700">
            Download care summary
          </button>
        </section>
      </div>

      <section className="mt-8 rounded-3xl bg-gradient-to-r from-sky-500 to-indigo-500 p-8 text-white shadow-lg">
        <h2 className="text-2xl font-semibold">Daily wellness check-in</h2>
        <p className="mt-2 text-sm text-slate-100">
          Log how you feel today so your care team can personalize your support.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {['Great', 'Good', 'Okay', 'Need assistance'].map(option => (
            <button
              key={option}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              {option}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

