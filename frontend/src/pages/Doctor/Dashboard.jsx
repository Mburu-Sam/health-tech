// frontend/src/pages/Doctor/Dashboard.jsx
const appointments = [
  { patient: 'Amanda Lee', time: '09:00 AM', type: 'Follow-up', room: '201B' },
  { patient: 'Carlos Mendes', time: '10:30 AM', type: 'New patient', room: '302A' },
  { patient: 'Priya Natarajan', time: '01:00 PM', type: 'Lab review', room: 'Telehealth' },
  { patient: 'Jacob Cruz', time: '02:15 PM', type: 'Physical', room: '105' }
];

const tasks = [
  { title: 'Approve new lab results', due: 'Due in 1 hr' },
  { title: 'Sign prescription renewals', due: 'Due today' },
  { title: 'Update patient summaries', due: 'Due tomorrow' }
];

export default function DoctorDashboard() {
  return (
    <div className="min-h-screen bg-white px-4 py-10 sm:px-8">
      <header className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-rose-500">
            Doctor workspace
          </p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">Good morning, Dr. Patel</h1>
          <p className="text-slate-600">You have 4 appointments scheduled for today.</p>
        </div>
        <button className="rounded-full bg-rose-500 px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-rose-600">
          Start virtual clinic
        </button>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        <article className="rounded-3xl border border-slate-100 bg-slate-900 p-8 text-white lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-slate-400">
                Today&apos;s schedule
              </p>
              <h2 className="mt-3 text-3xl font-semibold">Monday, 24 Feb</h2>
              <p className="mt-1 text-slate-400">Stay on track with your patient care</p>
            </div>
            <div className="rounded-2xl bg-slate-800 px-4 py-3 text-right">
              <p className="text-xs uppercase tracking-wider text-slate-400">Next break</p>
              <p className="text-xl font-semibold">45 min</p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {appointments.map(item => (
              <div
                key={item.patient}
                className="flex items-center justify-between rounded-2xl bg-white bg-opacity-5 px-4 py-3"
              >
                <div>
                  <p className="text-lg font-semibold">{item.patient}</p>
                  <p className="text-sm text-slate-300">
                    {item.type} • Room {item.room}
                  </p>
                </div>
                <span className="rounded-full bg-white bg-opacity-10 px-4 py-1 text-sm font-medium text-slate-100">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick actions</h2>
          <div className="mt-6 space-y-4">
            {tasks.map(task => (
              <div key={task.title} className="rounded-2xl border border-slate-100 p-4">
                <p className="text-sm font-medium text-slate-900">{task.title}</p>
                <p className="text-xs text-slate-500">{task.due}</p>
              </div>
            ))}
          </div>
          <button className="mt-6 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">
            Add new task
          </button>
        </article>
      </section>
    </div>
  );
}

