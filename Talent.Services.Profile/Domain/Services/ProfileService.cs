using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        private readonly IHostingEnvironment _environment;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;
        private readonly string _profileImageFolder;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService,
                              IHostingEnvironment environment)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
            _environment = environment;
            _profileImageFolder = "\\images\\";
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            //Your code here;
            User user = await _userRepository.GetByIdAsync(Id);
            if (user != null)
            {
                return ViewModelFromTalentProfile(user);
            }
            return null;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel newUserModel, string updaterId)
        {
            if (newUserModel.Id != null)
            {
                User user = await _userRepository.GetByIdAsync(newUserModel.Id);
                if (user != null)
                {
                    user.Id = newUserModel.Id;
                    user.FirstName = newUserModel.FirstName;
                    user.MiddleName = newUserModel.MiddleName;
                    user.LastName = newUserModel.LastName;
                    user.Gender = newUserModel.Gender;
                    user.Email = newUserModel.Email;
                    user.Phone = newUserModel.Phone;
                    user.MobilePhone = newUserModel.MobilePhone;
                    user.IsMobilePhoneVerified = newUserModel.IsMobilePhoneVerified;
                    user.Address = newUserModel.Address;
                    user.Nationality = newUserModel.Nationality;
                    user.VisaStatus = newUserModel.VisaStatus;
                    user.VisaExpiryDate = newUserModel.VisaExpiryDate;
                    user.VideoName = newUserModel.VideoName;
                    user.ProfilePhoto = newUserModel.ProfilePhoto;
                    user.ProfilePhotoUrl = newUserModel.ProfilePhotoUrl;
                    user.CvName = newUserModel.CvName;
                    user.Summary = newUserModel.Summary;
                    user.Description = newUserModel.Description;
                    user.LinkedAccounts = newUserModel.LinkedAccounts;
                    user.JobSeekingStatus = newUserModel.JobSeekingStatus;
                    user.UpdatedOn = DateTime.Now;
                   user.UpdatedBy = updaterId;
                   user.Skills= UpdateSkillList(user, newUserModel.Skills);

                    user.Languages = UpdateLanguageList(user, newUserModel.Languages);
                    user.Experience = UpdateExperienceList(user, newUserModel.Experience);
                    await _userRepository.Update(user);
                    return true;
                }
                return false;
            }
            return false;
        }

        private List<UserExperience> UpdateExperienceList(User user, List<ExperienceViewModel> experience)
        {
            var newExperienceList = new List<UserExperience>();

            if (experience is null)
            {
                return newExperienceList;    
            }

            foreach (var exp in experience)
            {
                var userExperience = user.Experience.SingleOrDefault(x => x.Id == exp.Id);
                if (userExperience == null)
                {
                    userExperience = new UserExperience
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        Company = exp.Company,
                        Responsibilities = exp.Responsibilities,
                        Position = exp.Position,
                        Start = exp.Start,
                        End = exp.End
                  
                    };

                }
                else
                {
                    userExperience.Company = exp.Company;
                    userExperience.Responsibilities = exp.Responsibilities;
                    userExperience.Position = exp.Position;
                    userExperience.Start = exp.Start;
                    userExperience.End = exp.End;
                }

                newExperienceList.Add(userExperience);
            }
            

            return newExperienceList;
        }

        private List<UserLanguage> UpdateLanguageList(User user, List<AddLanguageViewModel> languages)
        {

            var languageList = new List<UserLanguage>();
            if (languages is null)
            {
                return languageList;
            }

            foreach(var lang in languages)
            {
                var userLanguage = user.Languages.SingleOrDefault(x => x.Id == lang.Id);
                if (userLanguage == null)
                {
                    userLanguage = new UserLanguage
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        UserId = user.Id,
                        Language = lang.Name,
                        LanguageLevel = lang.Level,
                        IsDeleted = false
                    };
                    
                }
                else
                {
                    userLanguage.UserId = user.Id;
                    userLanguage.Language = lang.Name;
                    userLanguage.LanguageLevel = lang.Level;
                }
                languageList.Add(userLanguage);
            }
            return languageList;
        }

        protected List<UserSkill> UpdateSkillList(User exuser,List<AddSkillViewModel> viewModalSkills)
        {
            var newSkills = new List<UserSkill>();
            foreach (var item in viewModalSkills )
            {
                var skill = exuser.Skills.SingleOrDefault(x => x.Id == item.Id);
                if (skill == null)
                {
                    skill = new UserSkill
                    {
                        Id = ObjectId.GenerateNewId().ToString(),
                        IsDeleted = false
                    };
                }
                UpdateSkillFromView(item, skill);
                newSkills.Add(skill);
            }
            return newSkills;
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<string> UpdateTalentPhoto(string talentId, IFormFile imageFile)
        {
            string UploadFolder = Path.Combine(_environment.WebRootPath + _profileImageFolder);
            string fileName = talentId + '_' + imageFile.FileName;
            string UploadFilePath = Path.Combine(UploadFolder + fileName);
            string imagePath = "/images/" + fileName;
            imageFile.CopyTo(new FileStream(UploadFilePath, FileMode.Create));
            return imagePath;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {

            //Your code 
            var talents = (await _userRepository.Get(x => x.IsDeleted == false && x.Skills.Count > 0 )).Skip(position).Take(increment);

            if (talents != null)
            {
                List<TalentProfileViewModel> tals = talents.Select(x => ViewModelFromTalentProfile(x)).ToList();


                IEnumerable<TalentSnapshotViewModel> ttt = tals.Select(x => new TalentSnapshotViewModel()
                {
                    Id = x.Id,
                    Name = x.FirstName,
                    CVUrl = x.CvName,
                    PhotoId = x.ProfilePhotoUrl,
                    Skills = x.Skills.Select(s => s.Name).ToList(),
                    Visa = x.VisaStatus,
                    VideoUrl = x.VideoUrl,
                    Summary = x.Summary,
                    CurrentEmployment = x.Experience.OrderByDescending(f => f.Start).FirstOrDefault(),
                    LinkedAccounts = x.LinkedAccounts

                })  ;
                return ttt;
            }
            return null;
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }
        
        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        #endregion

        #region Build Views from Model
        protected TalentProfileViewModel ViewModelFromTalentProfile(User user)
        {
            var skills = user.Skills.Select(x => ViewModelFromSkill(x)).ToList();
            var educations = user.Education.Select(x => ViewModelFromEducation(x)).ToList();
            var experiences = user.Experience.Select(x => ViewModelFromExperience(x)).ToList();
            var certifications = user.Certifications.Select(x => ViewModelFromCertification(x)).ToList();
            var languages = user.Languages.Select(x => ViewModelFromLanguage(x)).ToList();
            var video = user.Videos.Where(x => x.FullVideoName.Equals(user.VideoName)).Select(x=>x.FullVideoName).FirstOrDefault();

            return new TalentProfileViewModel
            {
                Id = user.Id,
                FirstName = user.FirstName,
                MiddleName = user.MiddleName,
                LastName = user.LastName,
                Gender = user.Gender,
                Email = user.Email,
                Phone = user.Phone,
                MobilePhone = user.MobilePhone,
                IsMobilePhoneVerified = user.IsMobilePhoneVerified,
                Address = user.Address,
                Nationality = user.Nationality,
                VisaStatus = user.VisaStatus,
                VisaExpiryDate = user.VisaExpiryDate,
                VideoName = user.VideoUrl,
                VideoUrl = video,
                ProfilePhoto = user.ProfilePhoto,
                ProfilePhotoUrl = user.ProfilePhotoUrl,
                CvName = user.CvName,
                Summary = user.Summary,
                Description = user.Description,
                LinkedAccounts = user.LinkedAccounts,
                JobSeekingStatus = user.JobSeekingStatus,
                Languages = languages,
                Skills = skills,
                Education = educations,
                Certifications = certifications,
                Experience = experiences
            };
        }

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                Level = language.LanguageLevel,
                Name=language.Language,
                CurrentUserId = language.UserId
            };
        }

        protected AddEducationViewModel ViewModelFromEducation(UserEducation education)
        {
            return new AddEducationViewModel
            {
                Id = education.Id,
                Title=education.Title,
                InstituteName=education.InstituteName,
                Country=education.Country,
                Degree=education.Degree,
                YearOfGraduation=education.YearOfGraduation
            };
        }

        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationName=certification.CertificationName,
                CertificationFrom=certification.CertificationFrom,
                CertificationYear=certification.CertificationYear
                
            };
        }

        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Company = experience.Company,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Start = experience.Start,
                End = experience.End
            };
        }


        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }
         
        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
