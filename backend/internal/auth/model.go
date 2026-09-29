package auth

type Project struct {
	Name    string
	Banner  string
	LiveURL string
}

type User struct {
	Fullname string
	Email    string
	Age      int
}

type SignIn struct {
	Email    string
	Password string
}

type SignUp struct {
	Fullname string
	Email    string
	Password string
	Age      int
}
