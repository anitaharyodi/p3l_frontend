import React, { useContext } from 'react'
import { RoomContext } from '../../context/RoomContext';

function AdultsInput() {
  const { adultsGroup, setAdultsGroup } = useContext(RoomContext);

  return (
    <div className="relative flex bg-white items-center justify-between h-full">
      <div className="flex-1 p-4">
        <input
          type="number"
          className="w-full h-full cursor-pointer text-left focus:outline-none"
          value={adultsGroup}
          placeholder="Adults"
          onChange={(e) => setAdultsGroup(e.target.value)}
          min={0}
        />
      </div>
    </div>
  );
}

export default AdultsInput