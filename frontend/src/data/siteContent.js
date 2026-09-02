export const SITE_CONTENT_KEY = 'cornerstone_site_content'

const galleryCategories = {
  Worship: ['/images/cornerstone/page_01/page01_photo001_praise_and_worship_team_group.jpg', '/images/cornerstone/page_01/page01_photo002_worship_service_participants.jpg'],
  Conferences: ['/images/cornerstone/page_02/page02_photo005_conference_fellowship_table.jpg', '/images/cornerstone/page_02/page02_photo008_good_soil_conference_gathering.jpg'],
  Membership: ['/images/cornerstone/page_05/page05_photo022_membership_class_group.jpg'],
  ChildrenAndTeens: ['/images/cornerstone/page_06/page06_photo026_children_ministry_group.jpg'],
  Media: ['/images/cornerstone/page_08/page08_photo042_media_control_room.jpg'],
  MedicalOutreach: ['/images/cornerstone/page_09/page09_photo047_medical_camp_health_outreach.jpg'],
  CommunityOutreach: ['/images/cornerstone/page_10/page10_photo064_community_outreach_group.jpg'],
  CurrentNeeds: ['/images/cornerstone/page_12/page12_photo076_clinic_project_site.jpg'],
}

const defaultGallery = Object.entries(galleryCategories).flatMap(([category, images]) => images.map((image, index) => ({ id: `${category}-${index}`, image, description: `${category.replace(/([A-Z])/g, ' $1')} at Cornerstone Family Chapel`, category })))

export const defaultSiteContent = {
  users: [
    { id: 1, name: 'System Admin', email: 'admin@cornerstonechapel.org', role: 'admin', permissions: ['manage_users', 'manage_events', 'manage_sermons', 'manage_giving', 'manage_enquiries', 'manage_ministries', 'manage_pastors', 'manage_deacons'] },
    { id: 2, name: 'Media Account', email: 'media@cornerstonechapel.org', role: 'media', permissions: ['manage_events', 'manage_sermons', 'manage_gallery'] },
    { id: 3, name: 'Secretary Account', email: 'secretary@cornerstonechapel.org', role: 'secretary', permissions: ['manage_giving', 'manage_enquiries'] },
  ],
  gallery: defaultGallery,
  events: [
    {
      id: 1,
      title: 'Youth Revival Night',
      description: 'An evening of worship, teaching, and fellowship for the youth.',
      date: '2026-09-05',
      start_time: '18:00',
      end_time: '21:00',
      location: 'Main Sanctuary',
      map_url: 'https://maps.google.com/?q=Cornerstone Family Chapel',
      image: '/images/cornerstone/page_07/page07_photo033_worship_night.jpg',
      organizer: 'Youth Ministry',
      registration_status: 'open',
      max_participants: 100,
      registration_deadline: '2026-09-04',
    },
    {
      id: 2,
      title: "Men's Breakfast",
      description: 'Monthly gathering for men to connect over breakfast and discussion.',
      date: '2026-09-12',
      start_time: '08:00',
      end_time: '10:00',
      location: 'Church Hall',
      map_url: 'https://maps.google.com/?q=Cornerstone Family Chapel Church Hall',
      image: '/images/cornerstone/page_02/page02_photo005_conference_fellowship_table.jpg',
      organizer: "Men's Ministry",
      registration_status: 'open',
      max_participants: 50,
      registration_deadline: '2026-09-11',
    },
  ],
  sermons: [
    {
      id: 1,
      title: 'Walking in Faith: Trusting God\'s Plan',
      description: 'Discover how to trust God completely and walk in faith, even when the path is unclear.',
      speaker: 'Nahashon Wachira',
      date: '2026-08-25',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: '',
      thumbnail: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
      scripture: 'Proverbs 3:5-6',
      category: 'Faith',
      tags: ['faith', 'trust', 'proverbs'],
    },
    {
      id: 2,
      title: 'The Power of Prayer',
      description: 'Learn how prayer can transform your life and deepen your relationship with God.',
      speaker: 'Nahashon Wachira',
      date: '2026-08-18',
      video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      audio_url: '',
      thumbnail: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
      scripture: 'Philippians 4:6-7',
      category: 'Prayer',
      tags: ['prayer', 'philippians', 'peace'],
    },
  ],
  giving: [
    {
      id: 1,
      title: 'General Offering',
      description: 'Support the day-to-day ministry and operations of the church.',
      category: 'Offering',
      payment_method: 'M-Pesa',
      payment_details: 'Paybill: 000000\nAccount: Cornerstone Chapel',
      poster: '/chapel.jpg',
    },
    {
      id: 2,
      title: 'Missions Support',
      description: 'Help fund outreach and mission work in Kenya and beyond.',
      category: 'Missions',
      payment_method: 'Bank Transfer',
      payment_details: 'Bank: ABC Bank\nAccount Name: Cornerstone Chapel\nAccount No: 1234567890',
      poster: '/chapel.jpg',
    },
  ],
  settings: {
    church_name: 'Cornerstone Family Chapel',
    address: 'Cornerstone Family Chapel, Nairobi, Kenya',
    phone: '+254 700 000 000',
    email: 'hello@cornerstonechapel.org',
    service_times: 'Sunday Worship: 9:00 AM, Bible Study: Wednesday 6:30 PM',
    livestream_url: 'https://www.youtube.com/embed/live_stream?channel=UC_x5XG1OV2P6uZZ5FSM9Ttw',
    map_url: 'https://maps.google.com/?q=Cornerstone Family Chapel Nairobi',
    office_hours: 'Mon-Fri 8:00 AM - 5:00 PM',
  },
  ministries: [
    {
      id: 1,
      name: 'Youth Ministry',
      description: 'Empowering the next generation to grow in faith and serve with purpose.',
      leader: 'Nahashon Wachira',
      meeting_time: 'Fridays 6:00 PM',
      location: 'Youth Center',
      contact: 'youth@cornerstonechapel.org',
      image: '/chapel.jpg',
    },
    {
      id: 2,
      name: 'Children & Teens Ministry',
      description: 'Helping children and teens learn, worship, and grow in faith together.',
      leader: 'To be updated',
      meeting_time: 'To be updated',
      location: 'To be updated',
      contact: 'To be updated',
      image: '/images/cornerstone/page_06/page06_photo026_children_ministry_group.jpg',
    },
  ],
  pastors: [
    {
      id: 1,
      name: 'Nahashon Wachira',
      title: 'Senior Pastor',
      bio: 'Committed to discipleship, faithful preaching of God’s Word, and shepherding the congregation in love and truth.',
      image: '/images/cornerstone/page_01/page01_photo000_pastor_portrait.jpg',
      encouragement: '',
    },
  ],
  deacons: [
    {
      id: 1,
      name: 'Deacon Samuel Opiyo',
      role: 'Community outreach and member care',
      image: '/CFC_CHURCH_PHOTO.jpg',
      encouragement: '',
    },
    {
      id: 2,
      name: 'Deaconess Mercy Wanjiru',
      role: 'Hospitality and small groups',
      image: '/CFC_CHURCH_PHOTO.jpg',
      encouragement: '',
    },
  ],
}

export function readSiteContent() {
  if (typeof window === 'undefined') {
    return defaultSiteContent
  }

  try {
    const raw = window.localStorage.getItem(SITE_CONTENT_KEY)
    if (!raw) {
      window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(defaultSiteContent))
      return defaultSiteContent
    }

    const parsed = JSON.parse(raw)
    const storedUsers = parsed.users || defaultSiteContent.users
    const defaultUsersByEmail = Object.fromEntries(defaultSiteContent.users.map((user) => [user.email, user]))
    const users = storedUsers.filter((user) => user.role !== 'member').map((user) => ({
      ...defaultUsersByEmail[user.email],
      ...user,
      permissions: user.permissions?.length ? user.permissions : (defaultUsersByEmail[user.email]?.permissions || []),
    }))
    return {
      ...defaultSiteContent,
      ...parsed,
      users,
    }
  } catch (error) {
    return defaultSiteContent
  }
}

export function writeSiteContent(nextContent) {
  if (typeof window === 'undefined') {
    return
  }

  const merged = { ...defaultSiteContent, ...readSiteContent(), ...nextContent }
  window.localStorage.setItem(SITE_CONTENT_KEY, JSON.stringify(merged))
  window.dispatchEvent(new CustomEvent('cornerstone-content-updated'))
}

export function updateSiteCollection(key, items) {
  const current = readSiteContent()
  writeSiteContent({ ...current, [key]: items })
}
