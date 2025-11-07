import {useState} from 'react';
import {Modal, ModalContent, ModalBody, Button} from '@heroui/react';

const imgs = [
  {src:'/music-theory-class-18/assets/lesson20/G3.png', alt:'胸声 G3'},
  {src:'/music-theory-class-18/assets/lesson20/C4.png', alt:'胸声 C4'},
  {src:'/music-theory-class-18/assets/lesson20/B4.png',   alt:'ミックス B4'},
  {src:'/music-theory-class-18/assets/lesson20/E5.png', alt:'ファルセット E5'},
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
