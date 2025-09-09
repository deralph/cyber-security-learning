import React, { useContext, useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify'
import Quill from 'quill';
import uniqid from 'uniqid';
import axios from 'axios'
import { AppContext } from '../../context/AppContext';

const AddCourse = () => {
  const cloudinaryName = import.meta.env.VITE_CLOUDINARY_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME;

  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const { backendUrl, getToken, userData } = useContext(AppContext);

  const [courseTitle, setCourseTitle] = useState('');
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: '',
    lectureDuration: '',
    lectureUrl: '',
    lectureType: 'youtube',
    isPreviewFree: true,
    lectureFile: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleChapter = (action, chapterId) => {
    if (action === 'add') {
      const title = prompt('Enter Module Name:');
      if (title) {
        const newChapter = {
          chapterId: uniqid(),
          chapterTitle: title,
          chapterContent: [],
          collapsed: false,
          chapterOrder: chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
        };
        setChapters([...chapters, newChapter]);
      }
    } else if (action === 'remove') {
      setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
    } else if (action === 'toggle') {
      setChapters(
        chapters.map((chapter) =>
          chapter.chapterId === chapterId ? { ...chapter, collapsed: !chapter.collapsed } : chapter
        )
      );
    }
  };

  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === 'add') {
      setCurrentChapterId(chapterId);
      setShowPopup(true);
    } else if (action === 'remove') {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            chapter.chapterContent.splice(lectureIndex, 1);
          }
          return chapter;
        })
      );
    }
  };

  // Function to upload file to backend which will then upload to Cloudinary
  const uploadFileToServer = async (file, lectureType) => {
    console.log("lecture type in function = ",lectureType)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resourceType', lectureType === 'pdf' ? 'raw' : 'image');
    formData.append('fileName', file.name); // Pass the original file name
    
    try {
      const token = await getToken();
      const response = await axios.post(
        `${backendUrl}/api/educator/upload-file`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      
      if (response.data.success) {
        return response.data.fileUrl;
      } else {
        throw new Error(response.data.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      throw error;
    }
  };

  const addLecture = async () => {
    // Validate inputs
    if (!lectureDetails.lectureTitle) {
      toast.error('Please enter a lesson title');
      return;
    }
    
    if (!lectureDetails.lectureDuration || Number(lectureDetails.lectureDuration) <= 0) {
      toast.error('Please enter a valid duration');
      return;
    }
    
    if (lectureDetails.lectureType === 'youtube' && !lectureDetails.lectureUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    
    if ((lectureDetails.lectureType === 'pdf' || lectureDetails.lectureType === 'image') && !lectureDetails.lectureFile) {
      toast.error('Please select a file to upload');
      return;
    }
    console.log("lecture file = ",lectureDetails.lectureType)
    
    let finalUrl = lectureDetails.lectureUrl;
    
    // If a file is uploaded, upload it to the server first
    if (lectureDetails.lectureFile) {
      try {
        setUploading(true);
        finalUrl = await uploadFileToServer(lectureDetails.lectureFile, lectureDetails.lectureType);
      } catch (error) {
        setUploading(false);
        return; // Stop if upload fails
      }
    }
    
    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            lectureTitle: lectureDetails.lectureTitle,
            lectureDuration: lectureDetails.lectureDuration,
            lectureUrl: finalUrl,
            lectureType: lectureDetails.lectureType,
            lectureOrder: chapter.chapterContent.length > 0 ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1 : 1,
            lectureId: uniqid(),
            isPreviewFree: lectureDetails.isPreviewFree,
          };
          chapter.chapterContent.push(newLecture);
        }
        return chapter;
      })
    );
    
    setShowPopup(false);
    setUploading(false);
    setLectureDetails({
      lectureTitle: '',
      lectureDuration: '',
      lectureUrl: '',
      lectureType: 'youtube',
      isPreviewFree: true,
      lectureFile: null,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      if (!image) {
        toast.error('Thumbnail Not Selected');
        return;
      }

      if (chapters.length === 0) {
        toast.error('Please add at least one module');
        return;
      }

      // Check if all chapters have at least one lecture
      const emptyChapters = chapters.filter(chapter => chapter.chapterContent.length === 0);
      if (emptyChapters.length > 0) {
        toast.error('Each module must have at least one lesson');
        return;
      }

      const courseData = {
        courseTitle,
        courseDescription: quillRef.current.root.innerHTML,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append('courseData', JSON.stringify(courseData));
      formData.append('image', image);
      formData.append('email', userData.email);

      const token = await getToken();

      const { data } = await axios.post(
        backendUrl + '/api/educator/add-course', 
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      if (data.success) {
        toast.success('Security training module created successfully');
        setCourseTitle('');
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
      
      // Add custom styles for the dark theme
      const editor = editorRef.current;
      editor.style.backgroundColor = '#1f2937';
      editor.style.color = '#d1d5db';
      editor.style.borderColor = '#374151';
      editor.style.borderRadius = '0.375rem';
      
      // Style the toolbar
      const toolbar = editor.querySelector('.ql-toolbar');
      if (toolbar) {
        toolbar.style.backgroundColor = '#374151';
        toolbar.style.borderColor = '#4b5563';
        toolbar.style.borderTopLeftRadius = '0.375rem';
        toolbar.style.borderTopRightRadius = '0.375rem';
        
        // Style the buttons
        const buttons = toolbar.querySelectorAll('button, .ql-picker');
        buttons.forEach(button => {
          button.style.color = '#d1d5db';
        });
      }
      
      // Style the editor content area
      const content = editor.querySelector('.ql-container');
      if (content) {
        content.style.borderColor = '#4b5563';
        content.style.borderBottomLeftRadius = '0.375rem';
        content.style.borderBottomRightRadius = '0.375rem';
      }
    }
  }, []);

  return (
    <div className='h-screen overflow-scroll flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0 bg-gray-900'>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-md w-full text-gray-300'>
        <div className='flex flex-col gap-1'>
          <p>Training Module Title</p>
          <input 
            onChange={e => setCourseTitle(e.target.value)} 
            value={courseTitle} 
            type="text" 
            placeholder='Type security training title' 
            className='outline-none md:py-2.5 py-2 px-3 rounded border border-gray-600 bg-gray-800 text-white' 
            required 
          />
        </div>

        <div className='flex flex-col gap-1'>
          <p>Training Description</p>
          <div ref={editorRef} className="h-40 mb-4"></div>
        </div>

        <div className='flex items-center justify-between flex-wrap'>
          <div className='flex md:flex-row flex-col items-center gap-3'>
            <p>Module Thumbnail</p>
            <label htmlFor='thumbnailImage' className='flex items-center gap-3'>
              <div className='p-3 bg-green-600 rounded hover:bg-green-500 transition-colors cursor-pointer'>
                <img src={assets.file_upload_icon} alt="" className='filter invert' />
              </div>
              <input type="file" id='thumbnailImage' onChange={e => setImage(e.target.files[0])} accept="image/*" hidden />
              {image && (
                <img className='max-h-10 rounded border border-gray-600' src={URL.createObjectURL(image)} alt="" />
              )}
            </label>
          </div>
        </div>

        {/* Adding Chapters & Lectures */}
        <div>
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapterIndex} className="bg-gray-800 border border-gray-700 rounded-lg mb-4">
              <div className="flex justify-between items-center p-4 border-b border-gray-700">
                <div className="flex items-center">
                  <img 
                    className={`mr-2 cursor-pointer transition-all filter invert ${chapter.collapsed && "-rotate-90"} `} 
                    onClick={() => handleChapter('toggle', chapter.chapterId)} 
                    src={assets.dropdown_icon} 
                    width={14} 
                    alt="" 
                  />
                  <span className="font-semibold text-white">Module {chapterIndex + 1}: {chapter.chapterTitle}</span>
                </div>
                <span className="text-gray-400">{chapter.chapterContent.length} Lessons</span>
                <img 
                  onClick={() => handleChapter('remove', chapter.chapterId)} 
                  src={assets.cross_icon} 
                  alt="" 
                  className='cursor-pointer filter invert opacity-70 hover:opacity-100' 
                />
              </div>
              {!chapter.collapsed && (
                <div className="p-4">
                  {chapter.chapterContent.map((lecture, lectureIndex) => (
                    <div key={lectureIndex} className="flex justify-between items-center mb-2 py-2 border-b border-gray-700 last:border-b-0">
                      <span className="text-sm">
                        Lesson {lectureIndex + 1}: {lecture.lectureTitle} - {lecture.lectureDuration} mins - 
                        {lecture.lectureType === 'youtube' ? (
                          <a href={lecture.lectureUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 ml-1"> YouTube</a>
                        ) : (
                          <span className="text-green-400 ml-1"> {lecture.lectureType.toUpperCase()}</span>
                        )}
                        - {lecture.isPreviewFree ? 'Free Preview' : 'Restricted'}
                      </span>
                      <img 
                        onClick={() => handleLecture('remove', chapter.chapterId, lectureIndex)} 
                        src={assets.cross_icon} 
                        alt="" 
                        className='cursor-pointer filter invert opacity-70 hover:opacity-100' 
                      />
                    </div>
                  ))}
                  <div 
                    className="inline-flex bg-gray-700 p-2 rounded cursor-pointer mt-2 text-green-400 hover:bg-gray-600 transition-colors" 
                    onClick={() => handleLecture('add', chapter.chapterId)}
                  >
                    + Add Lesson
                  </div>
                </div>
              )}
            </div>
          ))}
          <div 
            className="flex justify-center items-center bg-green-900/30 p-2 rounded-lg cursor-pointer text-green-400 border border-green-700/50 hover:bg-green-900/50 transition-colors" 
            onClick={() => handleChapter('add')}
          >
            + Add Module
          </div>

          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-50">
              <div className="bg-gray-800 text-gray-300 p-6 rounded-lg relative w-full max-w-md border border-green-700/30">
                <h2 className="text-lg font-semibold mb-4 text-green-400">Add Lesson</h2>
                <div className="mb-3">
                  <p>Lesson Title</p>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-600 rounded py-2 px-3 bg-gray-700 text-white"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureTitle: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <p>Duration (minutes)</p>
                  <input
                    type="number"
                    min="1"
                    className="mt-1 block w-full border border-gray-600 rounded py-2 px-3 bg-gray-700 text-white"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureDuration: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-3">
                  <p>Lesson Type</p>
                  <select
                    className="mt-1 block w-full border border-gray-600 rounded py-2 px-3 bg-gray-700 text-white"
                    value={lectureDetails.lectureType}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, lectureType: e.target.value, lectureUrl: '', lectureFile: null })}
                  >
                    <option value="youtube">YouTube Video</option>
                    <option value="pdf">PDF Document</option>
                    <option value="image">Image</option>
                  </select>
                </div>
                {lectureDetails.lectureType === 'youtube' ? (
                  <div className="mb-3">
                    <p>YouTube URL</p>
                    <input
                      type="url"
                      className="mt-1 block w-full border border-gray-600 rounded py-2 px-3 bg-gray-700 text-white"
                      value={lectureDetails.lectureUrl}
                      onChange={(e) => setLectureDetails({ ...lectureDetails, lectureUrl: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      required
                    />
                  </div>
                ) : (
                  <div className="mb-3">
                    <p>Upload {lectureDetails.lectureType.toUpperCase()}</p>
                    <input
                      type="file"
                      className="mt-1 block w-full text-sm text-gray-400
                        file:mr-4 file:py-2 file:px-4
                        file:rounded file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-600 file:text-white
                        hover:file:bg-green-500"
                      accept={lectureDetails.lectureType === 'pdf' ? '.pdf' : 'image/*'}
                      onChange={(e) => setLectureDetails({ ...lectureDetails, lectureFile: e.target.files[0] })}
                      required
                    />
                    {lectureDetails.lectureFile && (
                      <p className="text-sm text-green-400 mt-2">
                        Selected: {lectureDetails.lectureFile.name}
                      </p>
                    )}
                  </div>
                )}
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="previewFree"
                    className="mr-2 h-4 w-4 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) => setLectureDetails({ ...lectureDetails, isPreviewFree: e.target.checked })}
                  />
                  <label htmlFor="previewFree" className="text-sm">Allow free preview</label>
                </div>
                <button 
                  type='button' 
                  className="w-full bg-green-600 text-white px-4 py-2 rounded mt-2 hover:bg-green-500 transition-colors disabled:bg-green-800 disabled:cursor-not-allowed"
                  onClick={addLecture}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Add Lesson'}
                </button>
                <img 
                  onClick={() => setShowPopup(false)} 
                  src={assets.cross_icon} 
                  className='absolute top-4 right-4 w-5 cursor-pointer filter invert opacity-70 hover:opacity-100' 
                  alt="" 
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className='bg-green-600 text-white w-max py-2.5 px-8 rounded my-4 hover:bg-green-500 transition-colors'>
          CREATE SECURITY MODULE
        </button>
      </form>
    </div>
  );
};

export default AddCourse;