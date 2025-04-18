import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Course {
  _id: string;
  title: string;
  description: string;
  poster:{url: string}; // URL or path to the course poster
  views: number; // Total number of views
  createdBy: {name:string,email:string,avatar:{url:string}}; // Creator's name or ID
  numOfVideos: number; // Number of lectures in the course
}

interface CourseLecture {
  _id: string;
  title: string;
  description: string;
  video: {url:string}; // URL or path to the course video
}

interface CourseState {
  courses: Course[];
  lectures: CourseLecture[];
  loading: boolean;
  error: string | null;
  message: string | null; // Optional: for success messages or other notifications
}

const initialState: CourseState = {
  courses: [],
  lectures: [],
  loading: false,
  error: null,
  message: null,
};

export const getadmincourse = createAsyncThunk(
  'course/getadmincourse',
  async () => {
    const res = await fetch(`http://localhost:10000/api/course/getadmincourse`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data.courses;
    } else {
      throw new Error(data.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourses = createAsyncThunk(
  'course/fetchCourses',
  async ({title,category}:{title:string;category:string}) => {
    const res = await fetch(`http://localhost:10000/api/course/courses?title=${title}&category=${category}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data.courses;
    } else {
      throw new Error(data.message || 'Failed to fetch courses');
    }
  }
);

export const createCourse = createAsyncThunk(
  'course/createCourse',
  async ({formdata}:{formdata:FormData}) => {
    const res = await fetch(`http://localhost:10000/api/course/courses`, {
      method: 'POST',
      credentials: 'include',
      body: formdata,
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch courses');
    }
  }
);

export const deletecourse = createAsyncThunk(
  'course/deletecourse',
  async ({id}:{id:string}) => {
    const res = await fetch(`http://localhost:10000/api/course/deletecourse/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch courses');
    }
  }
);

export const fetchCourseLectured = createAsyncThunk(
  'course/fetchCourseLectured',
  async ({id}:{id:string}): Promise<CourseLecture[]> => {
    const res = await fetch(`http://localhost:10000/api/course/courselectures/${id}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await res.json();
    if (data.success) {
      return data.courseLectures;
    } else {
      throw new Error(data.message || 'Failed to fetch courses Lectures');
    }
  }
);

export const addCourseLectured = createAsyncThunk(
  'course/addCourseLectured',
  async ({formdata,id}:{formdata:FormData,id:string}) => {
    const res = await fetch(`http://localhost:10000/api/course/courselectures/${id}`, {
      method: 'POST',
      credentials: 'include',
      body: formdata,
    });
    const data = await res.json();
    if (data.success) {
      return data;
    } else {
      throw new Error(data.message || 'Failed to fetch courses Lectures');
    }
  }
);

export const deleteCourseLectured = createAsyncThunk(
  'course/deleteCourseLectured',
  async ({ courseId, lectureId }: { courseId: string; lectureId: string }) => {
    if (!courseId || !lectureId) {
      throw new Error("Missing courseId or lectureId");
    }
    const url = new URL("http://localhost:10000/api/course/deleteLecture");
    url.searchParams.append("courseId", courseId);
    url.searchParams.append("lectureId", lectureId);

    const res = await fetch(url.toString(), {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-type': 'application/json' },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || "Deletion failed");
    return data;
  }
);



const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getadmincourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getadmincourse.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(getadmincourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch courses';
      })
      
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch courses';
      })

      .addCase(fetchCourseLectured.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseLectured.fulfilled, (state, action: PayloadAction<CourseLecture[]>) => {
        state.loading = false;
        state.lectures = action.payload;
      })
      .addCase(fetchCourseLectured.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch courses';
      })

      .addCase(addCourseLectured.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCourseLectured.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Course Lecture added successfully!'; // Optional: success message
      })
      .addCase(addCourseLectured.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch courses';
      })

      .addCase(deleteCourseLectured.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCourseLectured.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message || 'Course Lecture added successfully!'; // Optional: success message
      })
      .addCase(deleteCourseLectured.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch courses';
      })

      .addCase(createCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.course;
        state.message = action.payload.message || 'Course created successfully!'; // Optional: success message
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to fetch courses';
      })

      .addCase(deletecourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletecourse.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.course;
        state.message = action.payload.message || 'Course deleted successfully!'; // Optional: success message
      })
      .addCase(deletecourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? 'Failed to delete courses';
      });

   
  }
  
});



export default courseSlice.reducer;