import "../styles/Team.css";

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Ali Yılmaz",
      role: "Product Manager",
      email: "ali@taskflow.com",
      avatar: "AY",
      tasksCount: 8,
      status: "online",
    },
    {
      id: 2,
      name: "Ayşe Demir",
      role: "UI/UX Designer",
      email: "ayse@taskflow.com",
      avatar: "AD",
      tasksCount: 12,
      status: "online",
    },
    {
      id: 3,
      name: "Mehmet Kaya",
      role: "Frontend Developer",
      email: "mehmet@taskflow.com",
      avatar: "MK",
      tasksCount: 6,
      status: "offline",
    },
    {
      id: 4,
      name: "Zeynep Çelik",
      role: "Backend Developer",
      email: "zeynep@taskflow.com",
      avatar: "ZÇ",
      tasksCount: 9,
      status: "online",
    },
    {
      id: 5,
      name: "Can Öztürk",
      role: "UX Researcher",
      email: "can@taskflow.com",
      avatar: "CÖ",
      tasksCount: 5,
      status: "offline",
    },
    {
      id: 6,
      name: "Fatma Şahin",
      role: "QA Engineer",
      email: "fatma@taskflow.com",
      avatar: "FŞ",
      tasksCount: 7,
      status: "online",
    },
  ];

  return (
    <div className="team-page">
      <div className="team-header">
        <div>
          <h1>Takım</h1>
          <p className="subtitle">Takım üyelerini görüntüleyin ve yönetin</p>
        </div>
        <button className="btn-primary">+ Üye Ekle</button>
      </div>

      <div className="team-grid">
        {teamMembers.map((member) => (
          <div key={member.id} className="team-card">
            <div className="member-status">
              <span className={`status-indicator ${member.status}`}></span>
            </div>
            <div className="member-avatar-large">{member.avatar}</div>
            <h3 className="member-name">{member.name}</h3>
            <p className="member-role">{member.role}</p>
            <p className="member-email">{member.email}</p>

            <div className="member-stats">
              <div className="stat">
                <span className="stat-value">{member.tasksCount}</span>
                <span className="stat-label">Görevler</span>
              </div>
            </div>

            <div className="member-actions">
              <button className="btn-outline">Profil</button>
              <button className="btn-outline">Mesaj</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
