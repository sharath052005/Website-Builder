import React, { useEffect, useState, useRef } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types'
import {
  ArrowBigDownDashIcon,
  EyeIcon,
  EyeOffIcon,
  FullscreenIcon,
  LaptopIcon,
  Loader2Icon,
  MessageSquareIcon,
  SaveIcon,
  SmartphoneIcon,
  TabletIcon,
  XIcon,
} from 'lucide-react'
import { dummyConversations, dummyProjects, dummyVersion } from '../assets/assets'
import Sidebar from '../components/Sidebar'
import ProjectPreview, { type ProjectPreviewRef } from '../components/ProjectPreview'

const Projects = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  const [isGenerating, setIsGenerating] = useState(true)
  const [device, setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop')

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const previewRef = useRef<ProjectPreviewRef>(null)

  useEffect(() => {
    const found = dummyProjects.find(p => p.id === projectId)

    const timer = setTimeout(() => {
      if (found) {
        setProject({
          ...found,
          conversation: dummyConversations,
          versions: dummyVersion,
        })
        setIsGenerating(!found.current_code)
      }
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [projectId])

  const saveProject = async () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  const downloadCode = () => {
    const code =
      previewRef.current?.getCode() ?? project?.current_code

    if (!code || isGenerating) return

    const blob = new Blob([code], { type: 'text/html' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'index.html'
    document.body.appendChild(a)
    a.click()

    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const togglePublish = () => {
    if (!project) return
    setProject({ ...project, isPublished: !project.isPublished })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="size-7 animate-spin text-violet-200" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-2xl font-medium text-gray-200">
          Unable to load project!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white">
      {/* Header */}
      <div className="flex max-sm:flex-col sm:items-center gap-4 px-4 py-2">
        <div className="flex items-center gap-2 sm:min-w-[360px]">
          <img
            src="/favicon.svg"
            alt="logo"
            className="h-6 cursor-pointer"
            onClick={() => navigate('/')}
          />
          <div className="max-w-xs">
            <p className="text-sm font-medium capitalize truncate">
              {project.name}
            </p>
            <p className="text-xs text-gray-400">
              Previewing last saved version
            </p>
          </div>

          <div className="sm:hidden flex-1 flex justify-end">
            {isMenuOpen ? (
              <XIcon
                onClick={() => setIsMenuOpen(false)}
                className="size-6 cursor-pointer"
              />
            ) : (
              <MessageSquareIcon
                onClick={() => setIsMenuOpen(true)}
                className="size-6 cursor-pointer"
              />
            )}
          </div>
        </div>

        <div className="hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md">
          <SmartphoneIcon
            onClick={() => setDevice('phone')}
            className={`size-6 p-1 rounded cursor-pointer ${
              device === 'phone' ? 'bg-gray-700' : ''
            }`}
          />
          <TabletIcon
            onClick={() => setDevice('tablet')}
            className={`size-6 p-1 rounded cursor-pointer ${
              device === 'tablet' ? 'bg-gray-700' : ''
            }`}
          />
          <LaptopIcon
            onClick={() => setDevice('desktop')}
            className={`size-6 p-1 rounded cursor-pointer ${
              device === 'desktop' ? 'bg-gray-700' : ''
            }`}
          />
        </div>

        <div className="flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm">
          <button
            onClick={saveProject}
            disabled={isSaving}
            className="max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded border border-gray-700"
          >
            {isSaving ? (
              <Loader2Icon size={16} className="animate-spin" />
            ) : (
              <SaveIcon size={16} />
            )}
            Save
          </button>

          <Link
            target="_blank"
            to={`/preview/${projectId}`}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-1 flex items-center gap-2 rounded border border-gray-700 hover:border-gray-500"
          >
            <FullscreenIcon size={16} />
            Preview
          </Link>

          <button
            onClick={downloadCode}
            className="bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded"
          >
            <ArrowBigDownDashIcon size={16} />
            Download
          </button>

          <button
            onClick={togglePublish}
            className="bg-linear-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 flex items-center gap-2 rounded"
          >
            {project.isPublished ? (
              <EyeOffIcon size={16} />
            ) : (
              <EyeIcon size={16} />
            )}
            {project.isPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isMenuOpen={isMenuOpen}
          project={project}
          setProject={setProject}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />

        <div className="flex-1 p-2 pl-0">
          <ProjectPreview
            ref={previewRef}
            project={project}
            isGenerating={isGenerating}
            device={device}
          />
        </div>
      </div>
    </div>
  )
}

export default Projects
