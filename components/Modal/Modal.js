import { Fragment, useCallback, useRef, useState } from 'react';
import { useRecoilState } from 'recoil';
import { Dialog, Transition } from '@headlessui/react';
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from '@firebase/firestore';
import { ref, uploadString, getDownloadURL } from '@firebase/storage';

import { modalState } from '../../atoms/modalAtome';

import { CameraIcon } from '@heroicons/react/outline';

import { db, storage } from '../../firebase';
import { useSession } from 'next-auth/react';

function Modal() {
  const { data: session } = useSession();
  const [open, setOpen] = useRecoilState(modalState);
  const filePickerRef = useRef(null);
  const captionRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadPost = useCallback(async () => {
    if (loading) return;
    setLoading(true);

    // 1)create a post and add to firestore 'posts' collection
    // 2) get the post Id for the newly created post
    // 3) upload the image to firebase storage with the post Id
    // 4) get a download URL from fb storage and update the oriiginal post iwht image

    const post = await addDoc(collection(db, 'posts'), {
      username: session.user?.username,
      caption: captionRef.current.value,
      profileImg: session.user?.image,
      timestamp: serverTimestamp(),
    });
    const imageRef = ref(storage, `posts/${post.id}/image`);
    await uploadString(imageRef, selectedFile, 'data_url').then(
      async (snapshot) => {
        const downloadUrl = await getDownloadURL(imageRef);
        await updateDoc(doc(db, 'posts', post.id), { image: downloadUrl });
      }
    );

    setLoading(false);
    setOpen(false);
    setSelectedFile(null);
  }, [selectedFile, session]);

  const addImageToPost = useCallback((e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  }, []);

  if (!open) return null;

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as='div'
        className='fixed z-10 inset-0 overflow-y-auto'
        onClose={setOpen}
      >
        <div className='flex items-center justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-200'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>
          {/* trick to the browser into centering modal contents. */}
          <span className='hidden sm:inline-block sm:align-middle sm:h-screen'>
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-200'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6'>
              <div>
                {selectedFile ? (
                  <img
                    src={selectedFile}
                    onClick={() => setSelectedFile(null)}
                    alt=''
                  />
                ) : (
                  <div
                    onClick={() => filePickerRef.current.click()}
                    className='mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 cursor-pointer'
                  >
                    <CameraIcon
                      className='h-6 w-6 text-red-600'
                      aria-hidden='true'
                    />
                  </div>
                )}

                <div>
                  <div className='mt-3 text-center sm:mt-5'>
                    <Dialog.Title
                      as='h3'
                      className='text-lg leading-6 font-medium text-gray-900'
                    >
                      Upload a photo
                    </Dialog.Title>
                    <div>
                      <input
                        ref={filePickerRef}
                        type='file'
                        hidden
                        onChange={addImageToPost}
                      />
                    </div>
                    <div>
                      <input
                        className='border-none focus:ring-0 w-full text-center'
                        ref={captionRef}
                        type='text'
                        placeholder='Please enter a caption...'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-5 sm:mt-6'>
                  <button
                    type='button'
                    disabled={!selectedFile}
                    className='inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:bg-gray-300 disabled:cursor-not-allowed disabled:hover:bg-gray-300'
                    onClick={uploadPost}
                  >
                    {loading ? 'Uploading...' : 'Upload Post'}
                  </button>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

export default Modal;