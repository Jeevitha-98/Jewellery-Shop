
export default function Child({ name, email, role }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>📧 {email}</p>
      <p>💼 {role}</p>
    </div>
  );
}

