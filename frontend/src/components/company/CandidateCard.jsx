import api from "../../api/axios";

const CandidateCard = ({ candidate }) => {
  const sendMail = async () => {
    await api.post("/company/send-mail", {
      userId: candidate._id,
    });

    alert("Mail sent to candidate");
  };

  return (
    <div className="border p-5 rounded shadow">
      <h2 className="text-lg font-semibold">{candidate.name}</h2>

      <p className="text-gray-600">{candidate.email}</p>
      <p className="text-sm text-gray-500">
        Skills: {candidate.skills.join(", ")}
      </p>

      <a
        href={candidate.resume}
        target="_blank"
        className="text-blue-600 underline block mt-2"
      >
        View Resume
      </a>

      <button
        onClick={sendMail}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
      >
        Contact Candidate
      </button>
    </div>
  );
};

export default CandidateCard;
