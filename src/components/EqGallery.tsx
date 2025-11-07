import {useState} from 'react';
import {Modal, ModalContent, ModalBody, Button} from '@heroui/react';

const imgs = [
  {src:'/music-theory-class-18/assets/lesson20/eq_chest_G3.png', alt:'胸声 G3'},
  {src:'/music-theory-class-18/assets/lesson20/eq_chest_D4.png', alt:'胸声 D4'},
  {src:'/music-theory-class-18/assets/lesson20/eq_mix_A4.png',   alt:'ミックス A4'},
  {src:'/music-theory-class-18/assets/lesson20/eq_falsetto_F5.png', alt:'ファルセット F5'},
];

export default function EqGallery(){
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  return (
    <>
      <div className='grid grid-cols-2 gap-3'>
        {imgs.map((it,i)=>(
          <button key={i} onClick={()=>{setIdx(i); setOpen(true);}}
                  className='rounded-xl overflow-hidden border bg-white/70'>
            <img src={it.src} alt={it.alt} className='w-full h-auto block'/>
            <div className='p-2 text-sm text-black'>{it.alt}</div>
          </button>
        ))}
      </div>

      <Modal isOpen={open} onOpenChange={setOpen} size='xl' backdrop='blur'>
        <ModalContent>
          <ModalBody className='p-0'>
            <img src={imgs[idx].src} alt={imgs[idx].alt} className='w-full h-auto block'/>
            <div className='flex items-center justify-between p-3'>
              <Button variant='light' onPress={()=>setIdx((idx+3)%4)}>← Prev</Button>
              <div className='text-sm'>{imgs[idx].alt}</div>
              <Button variant='light' onPress={()=>setIdx((idx+1)%4)}>Next →</Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}