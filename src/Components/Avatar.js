import { useState
 } from 'react';
import avatar1 from '../Assets/Avatars/AVT-1.png';
import avatar2 from '../Assets/Avatars/AVT-2.png';
import avatar3 from '../Assets/Avatars/AVT-3.png';
import avatar4 from '../Assets/Avatars/AVT-4.png';
import avatar5 from '../Assets/Avatars/AVT-5.png';
import avatar6 from '../Assets/Avatars/AVT-6.png';
import avatar7 from '../Assets/Avatars/AVT-7.png';
import avatar8 from '../Assets/Avatars/AVT-8.png';
import avatar9 from '../Assets/Avatars/AVT-9.png';
import avatar10 from '../Assets/Avatars/AVT-10.png';
import avatar11 from '../Assets/Avatars/AVT-11.png';
import avatar12 from '../Assets/Avatars/AVT-12.png';
import avatar13 from '../Assets/Avatars/AVT-13.png';
import avatar14 from '../Assets/Avatars/AVT-14.png';
import avatar15 from '../Assets/Avatars/AVT-15.png';

const avatarOptions = [
  { id: 1, src: avatar1, name: 'Avatar 1' },
  { id: 2, src: avatar2, name: 'Avatar 2' },
  { id: 3, src: avatar3, name: 'Avatar 3' },
  { id: 4, src: avatar4, name: 'Avatar 4' },
  { id: 5, src: avatar5, name: 'Avatar 5' },
  { id: 6, src: avatar6, name: 'Avatar 6' },
  { id: 7, src: avatar7, name: 'Avatar 7' },
  { id: 8, src: avatar8, name: 'Avatar 8' },
  { id: 9, src: avatar9, name: 'Avatar 9' },
  { id: 10, src: avatar10, name: 'Avatar 10' },
  { id: 11, src: avatar11, name: 'Avatar 11' },
  { id: 12, src: avatar12, name: 'Avatar 12' },
  { id: 13, src: avatar13, name: 'Avatar 13' },
  { id: 14, src: avatar14, name: 'Avatar 14' },
  { id: 15, src: avatar15, name: 'Avatar 15' },
];



function AvatarSelector({ onSelectAvatar }) {

  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar.src);
    onSelectAvatar(avatar.src);
  };

  return (
    <div className="avatar-grid">
      {avatarOptions.map((avatar) => (
        <div
          key={avatar.id}
          className={`avatar-option`}
          onClick={() => handleAvatarClick(avatar)}
        >
          <img src={avatar.src} alt={avatar.name} className={selectedAvatar === avatar.src ? 'selected' : ''} />
        </div>
      ))}
    </div>
  );
}

export default function AvatarSelectionPage(props) {
  

  return (
    <div className="avatar-selection-page">
      <AvatarSelector onSelectAvatar={props.handleAvatarSelect}/>
    </div>
  );
}
