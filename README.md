# E-Prospector - a Cybercurrency Mining Game



## Links to;

[E-Prospector - Live Site](https://kelvenh.github.io/E-Prospector/)

[GitHub Repo](https://github.com/KelvenH/E-Prospector)

[Wireframes - v.Balsamiq](README-docs/Wireframe-Astrofly-Full-v.Balsamiq.bmpr)

[Wireframes - v.PDF](README-docs/Wireframe-Astrofly-Full.pdf)

***

## Contents

1. [Overview](#Overview)
2. [UX;](#UX)

   [- User Stories](#User-Stories)
   
   [- Personal Goals](#Personal-Goals)
   
   [- Structure](#Structure)
   
   [- Skeleton](#Skeleton)
   
   [- Surface](#Surface)
   
3. [Content & Design Features](#Content-and-Design-Features)
4. [Styles](#Styles)
5. [Images](#Images)
6. [Technologies Used](#Technologies-Used)
7. [Testing](#Testing)
8. [Bugs and Defects](#Bugs-and-Defects)
9. [Deployment](#Deployment)
10. [Acknowledgements](#Acknowledgements)



---
## Overview
  

---

## UX

### User Stories 


#### Business Requirements 
EZ;
- 
- 
- 

#### Client Goals 
Site visitors ;
- .  
 
### Design
(how is i

---
## Content and Key Features

Page | Features | In Build | Comments |
-----|----------|----------|----------|




---
## Styles

### Site Theme


### Color palette 


### Fonts and Typography


### Images

 Page    | Image - Description                    |                             Filename |                   Source |                               Notes |
---------|----------------------------------------|--------------------------------------|--------------------------|-------------------------------------|
Multiple | hex tiled pattern                      | tiled-hex_black.svg                  | stock.Adobe.com          |                                     |
Home     | Globe (hero img)                       |planet_earth.jpeg                     | stock.Adobe.com          |                                     |
 





---
## Technologies Used

Languages:

HTML5

CSS3

JavaScript / JSON

Google Fonts

Bootstrap 5.0 inc. Bootstrap Icons

Font Awesome

Adobe Illustrator




---
## Testing



---

## Bugs and Defects




---

## Git and Deployment

Build and deployment was delivered through GitHub, GitPod, GitPages and to a lesser extent GitDektop.

Day to day development is performed through GitPod which is used to interact with the repository on GitHub.
The terminal console within GitPod is used to synchronise changes between the two. Key commands are;

### Git Status 
- overview of current files in GitPod which are either waiting to be committed (unsent changes), untracked (new) or files deleted in GitPod but still held in current repo.

###Git add <file / folder name> 
- adds the new / updated file to a staging area ready to be committed. Where files share similarity in path and naming convention (e.g. multiple sized versions of same image) an asterick can be added against part of the name (such as assets/images/landscape* would add multiple versions of the image which started with the same name.

### Git add .  
- will add all files and folders to be committed including those where no changes are pending for upload. Note that early on this was misunderstood for meanining this was a shortcut for adding all files waiting to be committed. It was not until around mid-way through development that this was realised and whilst it has no adverse affect on the files content, it has meant that the same accompanying comments are loaded against all files where they have no relevance.

### Git commit -m "<comments>"
sends all files in the staging area to the GitHub repo.   

### Git rm <file / folder name> 
- removes any files currently staged (changes are not lost, just not held in the staging area)

### Git restore <file / folder name>  
- restores uncomitted files back to align with the version held in the main branch. For example, this could be used to 'undo' changes which have been saved locally but not yet committed or restore a file which has been deleted in GitPod (but remains available to retrieve from GitHub).

### Git push
- after changes have been comitted, this command will synchronise the changes with the main branch, bringing workspace, local repository and main (remote repository) in alignment.

##Forking 
Is the process by which versions of the files can be made. Whilst this is normal practice for web / app / software development, it enables mutiple users to work on aspects of the files at the same time. This was not something i needed to do as part of this project. However, GitHub allows forks to be created of any users repos (if made public) so a couple of other users repos were made to understand how this worked.

##Cloning 
This enables a complete clone of a repo to be made. Having installed GitDesktop i made a clone so as i could manage updates without having to pull from GitHub. However, this is an area to explore further as I failed to realise what benefit this was providing and feared risk of creating conflicts / multiple versions.

##Deployment 
Admittedly not found to be so intuitive and found there to be a lack of clear steps (early confusion as Git documentation switches referrences between GitHub, GitPages and GitDesktop without clarryfing specific roles. Ultimately the steps are quite forward once known.

- User starts from Github repository
- go to repo settings - cog icon displayed above repo information (not settings cog displayed slightly to the side of the repo which is general Github settings)
- scroll down to section "Github Pages"
- Source will display 'none' prior to the site being deployed.This is changed by clicking on the dropdown and selecting 'Master' (i noted Git documentation used the term 'main' so may be either or(?)
- Save the change. The site will then be generated (via GitPages) and the lik will be displayed. 
- Note, during development internal links (i.e. to assets file, images, css, etc) is through a localised referrence path known as 'relative'. Whilst this is fine during development (as this is operating via the repo the directory is housed in) for links to internal files (including other web pages on the site) the path needs to expand to include the path from the root directory. For example, a .css stylesheet maybe housed in the same folder as an image it is styling - the relative path is within the sane folder so there is no need for the path to include where in the directory that image file resides. However, when the site is published the links need to include the full path from the root directory.This is termed the 'absolute' path. 

---

### Acknowledgements - key sources and references 
- slack community 
- mentor (Seun Owonikoko)
- Whatsapp 'November-20 CodeInstitute' group
- Bootstrap documentation
- w3schools.com
- mozilla.com
- stackoverflow.com
- Github community
- YouTube (Steve Griffith & Dani Krossing)

