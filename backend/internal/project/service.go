package project

func ListProjectsCase() ([]Project, error) {
	project1 := Project{Name: "Website 1", Banner: "Banner 1", LiveURL: "Live URL 1"}
	project2 := Project{Name: "Website 2", Banner: "Banner 2", LiveURL: "Live URL 2"}
	projects := []Project{project1, project2}
	return projects, nil
}
