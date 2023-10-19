import React, { useContext } from 'react'
import { FaCheck } from 'react-icons/fa'
import { useParams } from 'react-router-dom'
import { RoomContext } from '../context/RoomContext'
import CheckIn from '../components/CheckIn'
import CheckOut from '../components/CheckOut'
import AdultsDropdown from '../components/AdultsDropdown'
import KidsDropdown from '../components/KidsDropdown'
import ScrollToTop from '../components/ScrollToTop'

const RoomDetails = () => {
  const {rooms} = useContext(RoomContext)
  const {id} =  useParams()

  const room = rooms.find((room) => {
    return room.id === Number(id)
  })
  
  const {name, description, facilities, imageLg, price } = room

  return (
    <section>
      <ScrollToTop/>
      <div className='relative h-[560px]'>
        <img className='bg-room object-cover w-full h-full' src={imageLg} alt='' />
        <div className='absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-black/50'>
          <h1 className='text-6xl text-white z-20 font-primary text-center'>{name} Details</h1>
        </div>
      </div>
      <div className='container mx-auto'>
        <div className='flex flex-col lg:flex-row h-full py-24'>
          <div className='w-full h-full lg:w-[60%] px-6'>
            <h2 className='h2'>{name}</h2>
            <p className='mb-8'>{description}</p>
            <img className='mb-8' src={imageLg} alt=''/>

            <div className='mt-12'>
              <h3 className='h3 mb-3'>Room Facilities</h3>
              <p className='mb-12'>Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic omnis temporibus quos consequuntur nam voluptatum ea accusamus, corrupti nostrum eum placeat quibusdam quis beatae quae labore earum architecto aliquid debitis.</p>
              <div className='grid grid-cols-3 gap-6 mb-12'>
                {facilities.map((item, index) => {
                  const {name, icon} = item
                  return (
                    <div className='flex items-center gap-x-3 flex-1' key={index}>
                      <div className='text-3xl text-accent'>{icon}</div>
                      <div className='text-base'>{name}</div>
                    </div>
                  ) 
                })}
              </div>
            </div>
          </div>
          <div className='w-full h-full lg:w-[40%]'>
            <div className='py-8 px-6 bg-accent/20 mb-12'>
              <div className='flex flex-col space-y-4 mb-4'>
                <h3 className='h3'>Your Reservation</h3>
                <div className='h-[60px]'>
                  <CheckIn className='mr-10'/>
                </div>
                <div className='h-[60px]'>
                  <CheckOut/>
                </div>
                <div className='h-[60px]'>
                  <AdultsDropdown/>
                </div>
                <div className='h-[60px]'>
                  <KidsDropdown/>
                </div>
              </div>
                <button className='btn btn-lg btn-primary w-full'>book now for IDR {price}</button>
            </div>
            <div>
              <h3 className='h3'>Hotel Rules</h3>
              <p className='mb-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit.Ea placeat eos sed voluptas unde veniam eligendi a. Quaerat molestiae hic omnis temporibus quos consequuntur nam voluptatum ea accusamus, corrupti nostrum eum placeat quibusdam quis beatae quae labore earum architecto aliquid debitis.</p>
              <ul className='flex flex-col gap-y-4'>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent'/>
                  Check-in: 3:00 PM - 9:00 PM
                </li>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent'/>
                  Check-out: 10:30 AM
                </li>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent'/>
                  No Pets
                </li>
                <li className='flex items-center gap-x-4'>
                  <FaCheck className='text-accent'/>
                  No Smoking
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoomDetails