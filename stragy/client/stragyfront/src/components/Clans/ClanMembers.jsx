const ClanMembers = ({ members }) => (
  <ul className='clan-members'>
    {Array.isArray(members) && members.map((member) => <li key={member.id || member.user_id}>{member.user?.username || member.username || 'Unknown member'}</li>)}
  </ul>
);

export default ClanMembers;
