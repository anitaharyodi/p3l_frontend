import React, { useContext } from 'react'
import { RoomContext } from '../../context/RoomContext';

function KidsInput() {
  const { kidsGroup, setKidsGroup } = useContext(RoomContext);

  return (
    <div className="relative flex bg-white items-center justify-between h-full">
      <div className="flex-1 p-4">
        <input
          type="number"
          className="w-full h-full cursor-pointer text-left focus:outline-none"
          value={kidsGroup}
          placeholder="Kids"
          onChange={(e) => setKidsGroup(e.target.value)}
          min={0}
        />
      </div>
    </div>
  );
}

export default KidsInput