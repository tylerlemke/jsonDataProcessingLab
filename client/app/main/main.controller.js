'use strict';

angular.module('jsonDataProcessingLabApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.students = [];

    $scope.predicate = '-lastName';
    $scope.showList = true;

    $scope.currentStudent = null;

    $http.get('/api/student').success(function(students) {
      $scope.students = students;
      socket.syncUpdates('student', $scope.students);

    });

      $scope.sortByCredits = function(){
        $scope.predicate = function(student){
            return $scope.addCredits(student);
        }
      };

        $scope.sortByGPA = function(){
            $scope.predicate = function(student){
                return $scope.calculateGpa(student);
            }
        };

        $scope.sortByCreditYear = function(){
            $scope.predicate = function(student){
                return $scope.calculateCreditYear(student);
            }
        };

        $scope.calculateCreditYear = function(student){
            if($scope.addCredits(student) < 30){
                return "Freshman"
            }
            else if($scope.addCredits(student) >= 30 || $scope.addCredits(student) < 60){
                return "Sophomore"
            }
            else if($scope.addCredits(student) >= 60 || $scope.addCredits(student) < 90){
                return "Junior"
            }
            else if($scope.addCredits(student) >= 90){
                return "Senior"
            }
        };

      $scope.addCredits = function(student){
            var credits=0;

            for(var i=0; i < student.courses.length; i++){
                if(student.courses[i].grade != "F" && student.courses[i].grade != "IP") {
                    credits = credits + student.courses[i].course.credits;
                }
            }
         return credits;
     };
        $scope.letterToNum = function(letter){
            console.log(letter);
            letter = letter.toUpperCase();
            switch(letter) {
                case "A":
                    return 4.0;
                case "B":
                    return 3.0;
                case "C":
                    return 2.0;
                case "D":
                    return 1.0;
                default:
                    return 0.0;
            }
        };
        $scope.calculateGpa = function(student){
            if(student.courses.length == 0){
                return 0;
            }
            var creditByGrade = 0;
            var totalCredits = 0;
            for(var i = 0; i< student.courses.length;i++){
                totalCredits += student.courses[i].course.credits;
                creditByGrade += (student.courses[i].course.credits * $scope.letterToNum(student.courses[i].grade));
            }
            return (creditByGrade / totalCredits).toFixed(2);
        };
   $scope.courseInfo = function(student) {
       $scope.showList = false;
       $scope.currentStudent = student;
   }
    $scope.studentInfo = function(student){
      $scope.showList = false;
      $scope.currentStudent = student;


    };

  });
